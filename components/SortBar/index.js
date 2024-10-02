import React from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'

const Sortbar = ({ sortOptions, sortBy, onSortChange }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const handleFilterChange = (event) => {
    onSortChange(event.target.value)
  }

  return (
    <div className="text-white inline-flex h-10 max-w-[250px]">
      <div
        className={`flex items-center gap-1 rounded-lg ${
          isLight ? 'bg-gray-200 bg-opacity-75' : 'bg-black-200 bg-opacity-75'
        } px-2`}
      >
        <label htmlFor="sortSelect" className="whitespace-nowrap text-[14px]">
          {t('sortBy')}
        </label>
        <select
          id="sortSelect"
          name="status"
          onChange={handleFilterChange}
          value={sortBy}
          className={`text-white w-full border-none text-[12px] md:text-[14px] px-2  ${
            isLight ? 'text-black-400' : 'text-[#99e24d] bg-black-200'
          }`}

        >
          {Object.keys(sortOptions).map((key) => (
            <option key={key} value={key}>
              {t(`${key}`)}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default Sortbar
