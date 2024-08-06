import { useState } from 'react'
import { FaRegCaretSquareDown, FaRegCaretSquareUp, FaMoneyBillAlt } from 'react-icons/fa'
import { useTheme } from 'next-themes'

const Filter = ({ filters, subItems, selectedFilters, setSelectedFilters }) => {
  const [isOpen, setIsOpen] = useState(
    Object.keys(filters).reduce((acc, filterName) => {
      acc[filterName] = false
      return acc
    }, {})
  )

  const { theme } = useTheme()
  const isLight = theme === 'light'

  const toggleOpen = (filterName) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [filterName]: !prevState[filterName],
    }))
  }

  const handleFilterSelect = (filterName, subItem) => {
    setSelectedFilters((prevState) => {
      const newFilters = { ...prevState }
      if (!newFilters[filterName]) {
        newFilters[filterName] = []
      }
      if (newFilters[filterName].includes(subItem)) {
        newFilters[filterName] = newFilters[filterName].filter((item) => item !== subItem)
      } else {
        newFilters[filterName].push(subItem)
      }
      return newFilters
    })
  }

  return (
    <div
      className={`text-white lg:w-[20%] w-[100%] rounded-lg p-2 ${
        isLight ? 'bg-gray-200 bg-opacity-75' : 'bg-black-200 bg-opacity-75'
      }`}
    >
      <h3 className="mb-2 text-lg font-bold">Filter</h3>
      <ul className="flex lg:flex-col flex-wrap mx-2 items-center lg:items-start justify-center">
        {Object.keys(filters).map((filterName) => (
          <li key={filterName} className="mb-2 lg:text-[14px] text-[12px] ml-1">
            <button
              onClick={() => toggleOpen(filterName)}
              className="flex w-full items-center rounded bg-black-300 bg-opacity-0 px-1 py-1"
            >
              {subItems[filterName].length > 0 ? (
                isOpen[filterName] ? (
                  <FaRegCaretSquareUp className="mr-2" />
                ) : (
                  <FaRegCaretSquareDown className="mr-2" />
                )
              ) : (
                <FaMoneyBillAlt className="mr-2" />
              )}
              <span className="capitalize">{filters[filterName]}</span>
            </button>
            {isOpen[filterName] && subItems[filterName].length > 0 && (
              <ul className="mt-1 ml-2 space-y-1">
                {subItems[filterName].map((subItem, index) => (
                  <li key={index} className="rounded bg-black-300 bg-opacity-15 px-1 py-1 text-[12px]">
                    <input
                      type="checkbox"
                      checked={selectedFilters[filterName]?.includes(subItem) || false}
                      onChange={() => handleFilterSelect(filterName, subItem)}
                      className="mr-2"
                    />
                    {subItem}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Filter
