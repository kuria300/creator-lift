from django.apps import AppConfig
import atexit


class CreatorappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'creatorapp'

    def ready(self):
        from .ai.services.llm import GeminiLLM
        self.gemini_llm = GeminiLLM()

        def close_gemini_llm():
            try:
                self.gemini_llm.close()
            except Exception as e:
                print(f"Error closing GeminiLLM: {e}")

        atexit.register(close_gemini_llm)

    # def ready(self):
    #     from .ai.services.llm import GeminiLLM

    #     self.gemini_llm = GeminiLLM()

    #     def close_gemini_llm():
    #         """"
    #         Close the GeminiLLM async client when the app is shutting down.
    #         """
    #         import asyncio

    #         try:
    #             loop = asyncio.get_running_loop()
    #             if loop.is_running():
    #                 asyncio.create_task(self.gemini_llm.close())
    #             else:
    #                 asyncio.run(self.gemini_llm.close())
    #         except RuntimeError:
    #             # If there's no running event loop, create a new one to close the client
    #             asyncio.run(self.gemini_llm.close())
    #         except Exception as e:
    #             print(f"Error closing GeminiLLM: {e}")


    #     atexit.register(close_gemini_llm)



