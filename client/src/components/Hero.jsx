import { ArrowRightIcon, DocumentTextIcon, ChatBubbleBottomCenterTextIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Policy Summaries',
    description: 'Get clear, concise summaries of complex policies',
    icon: DocumentTextIcon,
  },
  {
    name: 'Multi-language Support',
    description: 'Access policies in your preferred regional language',
    icon: GlobeAltIcon,
  },
  {
    name: 'AI Chatbot',
    description: 'Get instant answers to your policy questions',
    icon: ChatBubbleBottomCenterTextIcon,
  },
]

export default function Hero() {
  return (
    <div className="relative isolate">
      {/* Background gradient */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Making{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Policy Understanding
            </span>
            {' '}Simple
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            PolicyLens transforms complex policies into clear, accessible information. 
            Get instant summaries, regional language translations, and AI-powered assistance.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#"
              className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-secondary transition-all duration-300 hover:scale-105"
            >
              Get started
              <ArrowRightIcon className="ml-2 -mr-1 h-4 w-4 inline-block" />
            </a>
            <a href="#" className="text-sm font-semibold leading-6 text-gray-900 hover:text-secondary transition-colors duration-300">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* Feature section */}
        <div className="mx-auto mt-20 max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-4xl">
            <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="text-center">
                  <div className="flex flex-col items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/5 group hover:bg-primary/10 transition-colors duration-300">
                      <feature.icon className="h-8 w-8 text-primary group-hover:text-secondary transition-colors duration-300" aria-hidden="true" />
                    </div>
                    <h3 className="mt-6 text-base font-semibold leading-7 text-gray-900">{feature.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary to-secondary opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </div>
  )
}