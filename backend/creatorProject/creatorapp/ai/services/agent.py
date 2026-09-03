# This is the brain. 
# It receives the user's message from the view, calls llm.py to get a response, pulls the right prompt from prompts.py, and later will plug in memory and tools. 
# The view only talks to this file everything else is hidden behind it.

# It tells other developers, "This is an internal implementation detail. Do not call this method from outside the class."
# _build_tool the underscore

import json
from .llm import GeminiLLM
from django.conf import settings
from django.core.cache import caches
from .prompts import get_system_prompt, get_support_prompt, get_onboarding_prompt
from .tools import execute_tool, TOOLS
from ...models import AIConversation, AIMessage

memory_cache=caches['default']

HISTORY_TIMEOUT= 60 * 60
HISTORY_LIMIT=10

class AIagent:
    def __init__(self):

        self.llm = GeminiLLM()

    def handle_message(self, message, sender_id, conversation_id=None):
        """
         fetch converation history from redis
         fetch system prompts from prompt.py
         get the message build a full payload and send to llm
         if user requuires tool -yes
         call tools.py and send back to gemini to get full ans
         send updated history to redis
         send to view+serializers
        """
        try:
            if not conversation_id:
                conversation = AIConversation.objects.create(user_id=sender_id)
                conversation_id=str(conversation.id)
            else:
                try:
                    conversation = AIConversation.objects.get(id=conversation_id, user_id=sender_id)
                except AIConversation.DoesNotExist:
                    #  stops executing the current block and begins unwinding the call stack to find an enclosing try...except block capable of handling that specific error type. 
                    raise Exception("Conversation not found")


            history = self._get_history(conversation_id, conversation)

            system_prompt= get_system_prompt()
            full_prompt = self._build_prompt(system_prompt, history, message)

            llm_response = self.llm.generate(full_prompt)

            final_reply = self._handle_tool_call(llm_response, full_prompt)

            AIMessage.objects.create(conversation=conversation, role="user", content=message)
            AIMessage.objects.create(conversation=conversation, role="model", content=final_reply)

            history.append({"role": "user",  "content": message})
            history.append({"role": "model", "content": final_reply})
            self._save_history(conversation_id, history[-HISTORY_LIMIT:])
 
            return {"success": True, "reply": final_reply, "conversation_id":conversation_id}

        except Exception as e:
            return {'success':False, "error":str(e)}

    def _handle_tool_call(self, llm_response, original_text):
        """
        check if llm_response is plaintext if it is retrurn response as it is

        if llm_response is JSON we call the tool passed and get final_reply then return results back toi gemini
        
        """

        try:
            parsed = json.loads(llm_response)

            if not parsed.get('tool_call'):
                return llm_response
            
            tool_name = parsed.get("tool")
            params= parsed.get("params", {})

            tool_result = execute_tool(tool_name, params)
 
            # Feed result back to Gemini for a final human-readable reply
            followup_prompt = (
                f"{original_text}\n\n"
                f"[Tool result from {tool_name}]\n"
                f"{json.dumps(tool_result)}\n\n"
                f"Now give a helpful reply to the user based on this data."
            )
 
            final_reply = self.llm.generate(followup_prompt)
            return final_reply
 
        except (json.JSONDecodeError, KeyError):
            # Not JSON plain text reply, no tool needed
            return llm_response

    def _get_history(self, conversation_id, conversation=None):
        """ get conversation history from cache"""

        key = f'history:{conversation_id}'
        history=memory_cache.get(key=key)

        # cache hit
        if history is not None:
            return history
        
        if conversation is None:
            try:
                conversation = AIConversation.objects.get(id=conversation_id)
            except AIConversation.DoesNotExist:
                return []


        # cache miss so we fetch from db and populate cache
        messages= AIMessage.objects.filter(conversation=conversation).order_by('created_at')
        # return last 10 25-10 = messages[15:]
        messages=messages[max(0, (len(messages)-HISTORY_LIMIT)):]

        history = [{"role": msg.role, "content": msg.content} for msg in messages]

        if history:
            self._save_history(conversation_id, history)

        return history 
        
    def _save_history(self, conversation_id, history):
        """ save history to redis cache"""

        key =f'history:{conversation_id}'
        history = memory_cache.set(key, history, timeout=HISTORY_TIMEOUT)

    def _build_prompt(self, system_prompt, history, message):
        """
        assemble the full text and send to Gemini

        parts=[
          [system]
          you are a helpful assiatant..

          you have access to these tools: search, weather
          to call a tool only respond in JSON:
          {tool_call: true, "tool":"tool_name", params: {}}
          other wise reply normally as plain text
        ]

        [Conversation so far]
        user: Hello
        model: Hi there!

        [New message]
        user: What is the weather?


        """

        tool_names= ','.join(TOOLS.keys())

        # the \n creates a new line \n\n creates a blank line
        
        parts = [
            f"[System]\n{system_prompt}\n\n"
            f"You have access to these tools: {tool_names}\n"
            f"To call a tool respond ONLY with JSON:\n"
            f'{{"tool_call": true, "tool": "tool_name", "params": {{}}}}\n'
            f"Otherwise reply normally as plain text."
        ]

        if history:
            conversation = "\n".join( f"{turn['role']}: {turn['content']}" for turn in history)
            parts.append(f"[Conversation so far]\n{conversation}")
 
        parts.append(f"[New message]\n user: {message}")

        #  puts each on mew block
        return "\n\n".join(parts)

