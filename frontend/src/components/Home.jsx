import HomeNavbar from './layout/HomeNavbar'
import '../App.css'
import Footer from './Footer'
import { Handshake, Expand, Wallet, ArrowUpRight, ArrowRight, Play } from 'lucide-react'
import { animate, easeIn, easeInOut, easeOut, motion, useInView } from 'motion/react'
import Scroll from './animations/Scroll'
import Curtain from './animations/Curtain'


export const Home = () => {
 

  const features = [
  {
    title: "Expand your reach",
    description:
      "Share your work with a wider, engaged audience. No more feeling invisible—your content gets the spotlight it deserves.",
    icon: Expand,
  },
  {
    title: "Collaborate with brands",
    description:
      "Meet brands eager for authentic creators. Build partnerships that value your unique style and story.",
    icon: Handshake,
  },
  {
    title: "Earn from your creativity",
    description:
      "Transform your passion into income. Simple tools help you get noticed, grow, and get paid for what you love.",
    icon: Wallet,
  },
];

const journeySteps = [
  {
    number: "01",
    title: "Stand out to brands",
    description:
      "Share your work and let brands discover you. Your creativity rises above the noise and gets the attention it deserves.",
    button: "Discover",
  },
  {
    number: "02",
    title: "Expand your circle",
    description:
      "Meet fellow creators and brands who get you. Swap ideas, team up, and build real connections that last.",
    button: "Join",
  },
  {
    number: "03",
    title: "Open new doors",
    description:
      "Get access to resources, tips, and special offers to help you create, connect, and reach new fans.",
    button: "Begin",
  },
];


  return (
   <main>
    
     <div className='home-container'>
       <HomeNavbar />

       {/* <div className="absolute -top-40 -right-32 h-[500px] w-[500px] rounded-full bg-sky-300/30 blur-3xl" />
       <div className="absolute bottom-0 -left-32 h-[350px] w-[350px] rounded-full bg-sky-200/20 blur-3xl" /> */}
      <Scroll>
      <section className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-start justify-center px-6 pt-24 pb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-sky-600">
             Creators belong in the spotlight
          </div>

          {/* Heading */}
          <motion.h1 initial={{opacity: 0, y: -30}} animate={{opacity:1, y: 0}} transition={{duration: 2}} className="mt-6 max-w-4xl text-left text-6xl font-black leading-[0.95] tracking-tight text-black md:text-8xl font-teko">
            Be seen.
            <br />
            Get noticed.
            <br />
            <span className="bg-gradient-to-r from-sky-300 via-sky-400 to-sky-600 bg-clip-text text-transparent">
              Grow fast.
            </span>
          </motion.h1>

          {/* Description */}
          <p className="mt-8 max-w-xl text-base leading-relaxed text-neutral-600 md:text-lg">
            You're not just another profile lost in the feed. Here, your creativity
            takes center stage; no algorithms hiding your work. Connect with brands,
            find your people, and let your content open new doors.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            
            <Curtain
             Icon={ArrowRight}
             className="group inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition">
              Join Now
            </Curtain>

            <button className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-medium text-black transition hover:border-black">
              ▶ How it Works
            </button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid w-full max-w-3xl grid-cols-3 gap-8 border-t border-black/10 pt-8">
            <div>
              <div className="text-3xl font-bold text-black">1K+</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-neutral-500">
                Creators Lifted
              </div>
            </div>

            <div>
              <div className="text-3xl font-bold text-black">2+</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-neutral-500">
                Brand Partners
              </div>
            </div>

            <div>
              <div className="text-3xl font-bold text-black">0</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-neutral-500">
                Algorithmic Guesswork
              </div>
            </div>
          </div>

        </section>
        </Scroll>

        <section id="features" className="relative bg-white py-24 text-black">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-sky-600">
            What you get
          </p>

          <h2 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">
            Creators, seen and celebrated.
          </h2>

          <p className="mt-4 text-neutral-600">
            Step into a space where your creativity isn't hidden by algorithms.
            Find a supportive community, real brand connections, and the tools
            to help your voice rise above the noise.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white p-8 transition-all duration-300 hover:border-black hover:shadow-lg"
              >
                {/* Glow */}
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-sky-100 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative grid h-11 w-11 place-items-center rounded-lg bg-sky-100 text-sky-600 transition-all duration-300 group-hover:bg-sky-500 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="relative mt-6 text-xl font-semibold">
                  {feature.title}
                </h3>

                <p className="relative mt-3 text-sm leading-relaxed text-neutral-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>

   <Scroll>
    <section id="journey" className="relative overflow-hidden bg-white py-28 text-black">

      <div aria-hidden="true" className="absolute -top-30 left-1/2 h-96 w-[80%] -translate-x-1/2 rounded-full bg-sky-100/60 blur-3xl"/>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-600">
              The journey
            </p>

            <h2 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">
              Creators, lifted
              <br />
              and in the spotlight.
            </h2>
          </div>

          <p className="max-w-md text-neutral-600">
            Step into a space where your creativity gets noticed. Find the
            tools, support, and brand connections you need to grow and thrive.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {journeySteps.map((step) => (
            <article
              key={step.number}
              className="group flex flex-col justify-between rounded-2xl border border-black/10 bg-white p-8 transition-all duration-300 hover:border-black hover:shadow-lg"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-neutral-400">
                    {step.number}
                  </span>

                  <span className="grid h-8 w-8 place-items-center rounded-full bg-black text-white transition-all duration-300 group-hover:bg-sky-500">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                {/* Content */}
                <h3 className="mt-8 text-2xl font-semibold">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                  {step.description}
                </p>
              </div>

              {/* CTA */}
              <button className="mt-10 inline-flex w-fit items-center gap-2 border-b border-black pb-1 text-sm font-medium tracking-wide transition-all duration-300 hover:gap-3">
                {step.button}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
    </Scroll>

    <section className='py-24 overflow-hidden bg-sky-100/60 text-black'>
     <div className='flex items-center justify-center gap-4 flex-col'>
       <h2 className="text-4xl font-bold leading-tight md:text-5xl">
          Your voice is <span className='bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500 text-transparent bg-clip-text'>valued</span>.
          <br />
          Your journey matters.
        </h2>

        <p className='text-neutral-600 text-sm mt-4'>Join a community built to lift creators — not bury them under algorithms.</p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
            <button className="group inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500">
              Get started
             <ArrowRight className='transition group-hover:translate-x-1 w-4 h-4'/>
            </button>

            <button className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-medium text-black transition hover:border-black">
              Contact us
            </button>
          </div>
     </div>
    </section>

    <Footer />

  </div>    
</main>
  )
}
