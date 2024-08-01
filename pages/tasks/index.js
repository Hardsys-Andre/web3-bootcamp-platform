import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { withProtected } from '../../hooks/route'
import { getAllTasks } from '../../lib/tasks'
import { useTranslation } from 'react-i18next'
import SearchBar from '../../components/SearchBar'
import { MdGroup } from 'react-icons/md'
import { AiOutlineLike } from 'react-icons/ai'
import { Button, Image, Text } from '@nextui-org/react'
import Filter from '../../components/FilterTasks/index'
import Sortbar from '../../components/SortBar/index'
import { useTheme } from 'next-themes'

const IssueCard = ({ issue }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const isLight = theme === 'light'
  return (
    <div
      className={`flex md:flex-row flex-col items-center justify-center gap-2 rounded-lg p-4 shadow-lg ${
        isLight ? 'bg-gray-200 bg-opacity-75' : 'bg-black-200 bg-opacity-75'
      }`}
    >
      <div className="flex h-[40px] md:h-full w-[40px] md:w-[80px] items-center justify-center md:rounded-[20px] rounded-[10px] bg-[#99e24d]">
        <MdGroup size={70} color="white" />
      </div>
      <div className="mb-4 flex w-full flex-col gap-3">
        <div className="flex w-full items-center justify-between">
          <span className="md:text-[24px] text-[18px] text-[#99e24d]">{issue.title}</span>
          <button className="text-white mr-2 md:mr-4 rounded bg-[#99e24d] bg-opacity-30 px-2 py-1 md:text-sm text-[10px] hover:bg-[#649e26] focus:outline-none focus:ring-2 focus:ring-[#99e24d]">
            Apply
          </button>
        </div>
        <div className="flex w-full">
          <p className="text-[12px] md:text-[16px]">
            {issue.body}
          </p>
        </div>
        <div className="flex md:flex-row flex-col gap-3 text-gray-400">
          <p className="text-[14px]">
            <strong>Board:</strong> {issue.project_name}
          </p>
          <p className="text-[14px]">
            <strong>Created At:</strong> {new Date(issue.createdAt).toLocaleDateString()}
          </p>
          <p className="text-[14px]">
            <strong>Language:</strong> {issue.language}
          </p>
          <p className="text-[14px]">
            <strong>Skill:</strong> {new Date(issue.updatedAt).toLocaleDateString()}
          </p>
          <p className="text-[14px]">
            <strong>Reward:</strong> {new Date(issue.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}

const filtersTasks = {
  skill: 'Skill',
  effort: 'Effort',
  reward: 'Reward'
}

const subItems = {
  skill: ['Sub Item 1', 'Sub Item 2', 'Sub Item 3'],
  effort: ['demanding Team', 'Context Depth'],
  reward: []
}



const TaskPage = ({ issues }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const isLight = theme === 'light'
  const [filters, setFilters] = useState({})
  const [searchQuery, setSearchQuery] = useState('')

  const filteredIssues = issues.filter((issue) => {
    return !filters.status || issue.state === filters.status
  })

   const [issueCount, setIssueCount] = useState(filteredIssues.length)

   useEffect(() => {
     setIssueCount(filteredIssues.length)
   }, [filteredIssues])

  return (
    <>
      <Head>
        <title> Tasks - WEB3DEV</title>
      </Head>
      <div className="flex w-full items-center justify-center">
        <div className="flex xl:w-[80%] w-full flex-col">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <div className="flex">
            <div className="flex w-full flex-col items-start lg:flex-row md:mx-4">
              <Filter filters={filtersTasks} subItems={subItems} />  
              <div className="flex-1 p-2 ">
                {filteredIssues.length === 0 ? (
                  <p>{t('no-issues-found')}.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex h-10 flex-row items-center justify-between">
                      <Sortbar filters={filters} setFilters={setFilters} t={t}/>
                      <label className={`h-10 w-[80px] md:w-[100px] md:text-[16px] text-[10px] ${
                        isLight ? 'text-black-400' : 'text-[#99e24d]'}`}>{filteredIssues.length} PROJECTS</label>
                    </div>
                    <div
                      className={`flex flex-row gap-2 rounded-lg p-2 shadow-lg ${
                        isLight ? 'bg-gray-200 bg-opacity-75' : 'bg-black-200 bg-opacity-75'
                      }`}
                    >
                      <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[10px] bg-white-100 bg-opacity-25">
                        <AiOutlineLike size={30} color="#99e24d" />
                      </div>
                      <div className="flex w-full flex-col gap-0">
                        <div className="flex w-full items-center justify-between">
                          <span className="text-white md:text-[24px] text-[18px]">Good first issues</span>
                          <div className="flex md:w-[30px] w-[20px] items-center justify-center md:rounded-[20px] rounded-[10px] bg-[#99e24d] bg-opacity-30">
                            <p className="text-[#99e24d] text-[12px] md:text-[16px]">1</p>
                          </div>
                        </div>
                        <div className="flex w-full">
                          <p className="md:text-[16px] text-[12px]">
                            Apply to a list of curated issues well suited for those new to the
                            project to kickstart your journey.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      {filteredIssues.map((issue) => (
                        <IssueCard key={issue.github_id} issue={issue} t={t} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  try {
    const issues = await getAllTasks()
    return {
      props: { issues },
    }
  } catch (error) {
    console.error('Error fetching issues:', error)
    return {
      props: { issues: [] },
    }
  }
}

export default withProtected(TaskPage)