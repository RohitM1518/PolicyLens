import { ArrowRightIcon, DocumentTextIcon, ChatBubbleBottomCenterTextIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { Link } from 'react-scroll';
import { motion } from 'framer-motion'; // You'll need to install framer-motion

const features = [
  {
    name: 'Policy Summaries',
    description: 'Transform lengthy insurance documents into clear, digestible summaries. Our AI-powered system highlights key terms, coverage details, and important clauses, making it easier than ever to understand your policy.',
    icon: DocumentTextIcon,
    color: 'from-blue-400 to-blue-600'
  },
  {
    name: 'Multi-language Support',
    description: 'Break down language barriers with instant translations into multiple regional languages. Get accurate, context-aware translations that maintain the precise meaning of your policy documents.',
    icon: GlobeAltIcon,
    color: 'from-green-400 to-green-600'
  },
  {
    name: 'AI Chatbot',
    description: 'Have questions? Our intelligent chatbot provides instant, accurate responses about your policy. Upload your documents and get immediate clarification on terms, coverage, and claims processes.',
    icon: ChatBubbleBottomCenterTextIcon,
    color: 'from-purple-400 to-purple-600'
  },
];

export default function Hero() {
  const isLoggedIn = useSelector(state=>state?.isLoggedIn);

  return (
    <div className="relative isolate min-h-screen">
      {/* Enhanced Background gradient with animation */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        {/* Your existing gradient div */}
      </motion.div>

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Making{' '}
            <motion.span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
              animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Policy Understanding
            </motion.span>
            {' '}Simple
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            PolicyLens transforms complex policies into clear, accessible information. 
            Get instant summaries, regional language translations, and AI-powered assistance.
          </p>
          
          {/* Enhanced CTA buttons */}
          <motion.div 
            className="mt-10 flex items-center justify-center gap-x-6"
            whileHover={{ scale: 1.05 }}
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={isLoggedIn?"/summaries":"/signup"}
              className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-secondary transition-all duration-300"
            >
              Get started
              <ArrowRightIcon className="ml-2 -mr-1 h-4 w-4 inline-block" />
            </motion.a>
            <Link to='section1' smooth={true} duration={500}>
              <motion.p 
                whileHover={{ x: 10 }}
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-secondary transition-colors duration-300 hover:cursor-pointer"
              >
                Learn more <span aria-hidden="true">→</span>
              </motion.p>
            </Link>
          </motion.div>
        </motion.div>

        {/* Enhanced Feature section */}
        <div className="mx-auto mt-20 max-w-7xl px-6 lg:px-8" id='section1'>
          <div className="mx-auto max-w-2xl lg:max-w-4xl">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ y: -10 }}
                  className="text-center"
                >
                  <div className="flex flex-col items-center">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r shadow-lg"
                    >
                      <feature.icon className="h-8 w-8 " aria-hidden="true" />
                    </motion.div>
                    <h3 className="mt-6 text-base font-semibold leading-7 text-gray-900">{feature.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Your existing bottom gradient */}
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
  );
}
