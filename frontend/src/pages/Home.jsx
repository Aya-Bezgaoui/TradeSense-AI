import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'

const Home = () => {
  const [prices, setPrices] = useState({})
  const [loading, setLoading] = useState(true)

  // Fetch live prices for ticker display
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const symbols = ['BTC-USD', 'AAPL', 'TSLA', 'IAM', 'ATW']
        const priceData = {}
        
        for (const symbol of symbols) {
          try {
            const response = await api.get(`/market/quote?symbol=${symbol}`)
            priceData[symbol] = response.data
          } catch (error) {
            console.log(`Failed to fetch ${symbol}`, error)
          }
        }
        
        setPrices(priceData)
      } catch (error) {
        console.error('Failed to fetch prices:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
    // Refresh prices every 30 seconds
    const interval = setInterval(fetchPrices, 30000)
    return () => clearInterval(interval)
  }, [])

  const tickerItems = [
    { symbol: 'BTC-USD', name: 'Bitcoin' },
    { symbol: 'AAPL', name: 'Apple' },
    { symbol: 'TSLA', name: 'Tesla' },
    { symbol: 'IAM', name: 'Itissalat Al-Maghrib' },
    { symbol: 'ATW', name: 'Attijariwafa Bank' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Master Trading with
                <span className="block text-yellow-300">Virtual Funds</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl">
                Join thousands of aspiring traders practicing with real market data. 
                Prove your skills and get funded to trade with real capital.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/pricing" className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 text-center">
                  Start Trading Free
                </Link>
                <Link to="/leaderboard" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-4 px-8 rounded-lg text-lg transition-all text-center">
                  View Leaderboard
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            >
              <h3 className="text-2xl font-bold mb-6 text-center">Live Market Prices</h3>
              <div className="space-y-4">
                {tickerItems.map((item) => {
                  const priceData = prices[item.symbol]
                  return (
                    <div key={item.symbol} className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-sm opacity-80">{item.symbol}</div>
                      </div>
                      {priceData ? (
                        <div className={`text-right ${priceData.change >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                          <div className="font-bold">${priceData.price.toLocaleString()}</div>
                          <div className="text-sm">
                            {priceData.change >= 0 ? '+' : ''}{priceData.change_percent}%
                          </div>
                        </div>
                      ) : (
                        <div className="h-10 w-20 bg-white/20 rounded animate-pulse"></div>
                      )}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose TradeSense?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Professional trading simulation platform designed for serious traders
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                ),
                title: "Real Market Data",
                description: "Practice with live international and Moroccan market data. Experience real trading conditions."
              },
              {
                icon: (
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Risk-Free Learning",
                description: "Trade with virtual funds. Learn without risking real money. Perfect for beginners and pros alike."
              },
              {
                icon: (
                  <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Get Funded",
                description: "Prove your trading skills and earn real funding opportunities. Turn practice into profit."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Start your trading journey in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Choose Your Plan",
                description: "Select from Starter, Pro, or Elite plans with different virtual balances and features."
              },
              {
                step: "02",
                title: "Start Trading",
                description: "Access our advanced trading platform with real market data and professional tools."
              },
              {
                step: "03",
                title: "Get Funded",
                description: "Achieve 10% profit target and unlock real funding opportunities for your trading career."
              }
            ].map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 relative z-10">
                  {step.step}
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transform -translate-y-1/2"></div>
                )}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Trading Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of traders who are mastering the markets with TradeSense
          </p>
          <Link to="/pricing" className="inline-block bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home