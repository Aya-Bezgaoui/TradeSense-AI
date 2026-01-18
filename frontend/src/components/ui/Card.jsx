import React from 'react'

const Card = ({ 
  children, 
  className = '', 
  header = null, 
  footer = null,
  variant = 'default',
  ...props 
}) => {
  const baseClasses = 'rounded-xl border shadow-lg overflow-hidden'
  
  const variants = {
    default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-xl',
    outlined: 'bg-transparent border-gray-300 dark:border-gray-600'
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${className}`

  return (
    <div className={classes} {...props}>
      {header && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          {typeof header === 'string' ? (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{header}</h3>
          ) : header}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card