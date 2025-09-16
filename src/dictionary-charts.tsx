import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import {
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  CartesianGrid
} from 'recharts'
import { css } from '~styled-system/css'

const DictionaryCharts = () => {
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [expandedIndex, setExpandedIndex] = useState(null) 
  const serverUrl = 'https://mwamed.com/syllabe-boreale/server/api/vocabulary'

  const sourceData = [
    { source: 'Larousse', definitions: 990992 },
    { source: 'Wiktionnaire', definitions: 572727 },
    { source: 'LeDictionnaire', definitions: 339440 },
    { source: 'Robert', definitions: 108488 },
    { source: 'Universalis', definitions: 47811 },
    { source: 'Cordial', definitions: 39545 }
  ]

  const generalStats: any = [
    { metric: 'Total Definitions', value: 2099003 },
    { metric: 'Words with Definition', value: 461244 },
    { metric: 'Avg Definitions/Word', value: (2099003 / 461244).toFixed(1) }
  ]

  const endpoints = [
    {
      method: 'GET',
      path: '/def/word-name/{word}',
      desc: 'Retrieves definitions for a specific word',
      body: null,
      example: {
        success: true,
        word_details: {
          id: 413033,
          word: 'prendre',
          created_at: '2025-05-19T15:13:09.411Z',
          creator_id: 1
        },
        definitions: [
          {
            id: 1909789,
            word_id: 413033,
            definition: 'Inscrire ou reproduire. Prendre des notes, une photo.',
            source_id: 7,
            source_name: 'Robert',
            created_at: '2025-06-10T04:10:57.219Z'
          }
        ]
      }
    },
    {
      method: 'GET',
      path: '/words/{word}/count',
      desc: 'Returns the count of definitions for a word',
      body: null,
      example: {
        success: true,
        word: 'test',
        count: '51',
        timestamp: '2025-09-10T20:07:51.779Z'
      }
    },
    {
      method: 'GET',
      path: '/words/{word}/definition?source={source}',
      desc: 'Fetches a word’s definition from a specific source',
      body: null,
      example: {
        success: true,
        definition: {
          id: 179309,
          word_id: 116991,
          definition:
            "épreuve qui permet d'évaluer quelqu'un ou de déterminer les caractéristiques de quelque chose",
          source_id: 2,
          source_name: 'Universalis',
          created_at: '2025-06-08T23:18:26.960Z'
        },
        timestamp: '2025-09-10T20:13:05.427Z'
      }
    },
    {
      method: 'GET',
      path: '/definitions/contains?word={word}',
      desc: 'Searches for definitions containing a specific word',
      body: null,
      example: {
        success: true,
        query: 'sovnarkhoze',
        definitions: [
          {
            id: 1507173,
            word_id: 104052,
            definition: 'Conseil économique régional crée en URSS en 1957.',
            source_id: 1,
            source_name: 'Wiktionnaire',
            created_at: '2025-06-09T23:20:51.781Z'
          },
          {
            id: 426412,
            word_id: 439159,
            definition: 'Pluriel de sovnarkhoze.',
            source_id: 1,
            source_name: 'Wiktionnaire',
            created_at: '2025-06-09T08:40:00.210Z'
          }
        ],
        count: 2,
        timestamp: '2025-09-10T20:17:59.414Z'
      }
    },
    {
      method: 'POST',
      path: '/find-words',
      desc: 'Finds words matching a specified pattern. Available list names: word | is_adverb | is_demonym | is_verb | is_animal',
      body: {
        searchParams: {
          listname: 'word',
          pattern: 'er'
        }
      },
      example: {
        success: true,
        listname: 'word',
        pattern: 'er',
        data: [
          'grefferont',
          'desopileriez',
          'therapeutique',
          'formaliserons',
          'hermitique'
        ],
        timestamp: '2025-09-10T20:19:40.959Z',
        total: 131491,
        hasMore: 131471
      }
    },
    {
      method: 'POST',
      path: '/find-syllables',
      desc: 'Returns syllables based on the pattern contained in dictionary words. Available list names: word | is_adverb | is_demonym | is_verb | is_animal',
      body: {
        searchParams: {
          listname: 'word',
          pattern: 'r'
        }
      },
      example: {
        success: true,
        listname: 'word',
        pattern: 'er',
        data: [
          'ero',
          'oer',
          'ere',
          'era',
          'erg',
          'xer',
          'erb',
          'erj',
          'ers',
          'mer',
          'ier',
          'ker',
          'aer'
        ],
        timestamp: '2025-09-10T20:26:54.338Z',
        total: 51,
        hasMore: 31
      }
    }
  ]

  const constraints = [
    { metric: 'Rate Limit', value: '1000 req/hour' },
    { metric: 'Burst Limit', value: '30 req/minute' },
    { metric: 'Available Sources', value: '6 dictionaries' }
  ]

  const formatNumber = (value: any) =>
    typeof value === 'number'
      ? new Intl.NumberFormat('en-US').format(value)
      : value

  const handleCopy = async (endpoint: any, index: any) => {
    try {
      await navigator.clipboard.writeText(`${serverUrl}${endpoint.path}`)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const toggleExpand = (index: any) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  const renderPathWithColors = (path: any) => {
    return path
      .replace(
        /\{word\}/g,
        '<span style="color: #ef4444; font-weight: bold;">{word}</span>'
      )
      .replace(
        /\{source\}/g,
        '<span style="color: #10b981; font-weight: bold;">{source}</span>'
      )
      .replace(
        /\{listname\}/g,
        '<span style="color: #3b82f6; font-weight: bold;">{listname}</span>'
      )
  }

  const renderBodySchema = (body: any) => {
    if (!body) return null
    const coloredBody = JSON.stringify(body, null, 2)
      .replace(
        /"word"/g,
        '<span style="color: #f59e0b; font-weight: bold">"word"</span>'
      )
      .replace(
        /"is_adverb"/g,
        '<span style="color: #10b981; font-weight: bold">"is_adverb"</span>'
      )
      .replace(
        /"is_demonym"/g,
        '<span style="color: #3b82f6; font-weight: bold">"is_demonym"</span>'
      )
      .replace(
        /"is_verb"/g,
        '<span style="color: #ef4444; font-weight: bold">"is_verb"</span>'
      )
      .replace(
        /"is_animal"/g,
        '<span style="color: #d946ef; font-weight: bold">"is_animal"</span>'
      )
    return (
      <div
        className={css({
          fontSize: { base: 11, md: 12 },
          color: '#9ca3af',
          fontFamily: 'mono',
          mt: '2',
          bg: '#181818',
          p: '2',
          borderRadius: 'sm',
          border: '1px solid #2a2a2a'
        })}
      >
        <pre dangerouslySetInnerHTML={{ __html: coloredBody }} />
      </div>
    )
  }

  const renderExampleSchema = (example: any) => {
    if (!example) return null
    const coloredExample = JSON.stringify(example, null, 2)
    return (
      <div
        className={css({
          fontSize: { base: 11, md: 12 },
          color: '#9ca3af',
          fontFamily: 'mono',
          mt: '2',
          bg: '#',
          p: '2',
          borderRadius: 'sm',
          border: '1px solid #2a2a2a'
        })}
      >
        <pre>{coloredExample}</pre>
      </div>
    )
  }

  return (
    <div
      className={css({
        bg: 'radial-gradient(circle at top, #111 0%, #000 100%)',
        color: '#f1f5f9',
        minH: '100vh',
        display: 'flex',
        justifyContent: 'center',
        py: '4',
        px: { base: '2', md: '4' },
        overflow: 'hidden'
      })}
    >
      <div
        className={css({
          bg: '#0a0a0a',
          borderRadius: '2xl',
          p: { base: '4', md: '6' },
          shadow: '2xl',
          border: '1px solid #222',
          w: '100%',
          maxW: '1600px',
          display: 'flex',
          flexDirection: 'column',
          gap: { base: '2', md: '3' }
        })}
      >
        <div className={css({ textAlign: 'center' })}>
          <h1
            className={css({
              fontSize: { base: 'xl', md: '2xl' },
              fontWeight: 'bold',
              color: '#f1f5f9',
              mb: '2'
            })}
          >
            Dictionary API
          </h1>
          <p
            className={css({
              color: '#9ca3af',
              fontSize: { base: 'sm', md: 'md' }
            })}
          >
            French definitions from multiple sources
          </p>
        </div>

        {/* Stats */}
        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: {
              base: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(6, 1fr)'
            },
            gap: { base: '2', md: '3' },
            py: '2'
          })}
        >
          {constraints.concat(generalStats).map((item, index) => (
            <div
              key={index}
              className={css({
                bg: '#1a1a1a',
                border: '1px solid #2a2a2a',
                px: { base: '2', md: '3' },
                py: { base: '2', md: '2' },
                borderRadius: 'lg',
                textAlign: 'center',
                transition: 'all 0.2s',
                _hover: { bg: '#222', borderColor: '#333' }
              })}
            >
              <div
                className={css({
                  fontSize: { base: '2xs', md: 'xs' },
                  color: '#9ca3af',
                  mb: '1',
                  fontWeight: 'medium'
                })}
              >
                {item.metric}
              </div>
              <div
                className={css({
                  fontSize: { base: 'xs', md: 'sm' },
                  fontWeight: 'bold',
                  fontFamily: 'mono',
                  color: '#f1f5f9',
                  wordBreak: 'break-all'
                })}
              >
                {formatNumber(item.value)}
              </div>
            </div>
          ))}
        </div>

        {/* Graph + endpoints */}
        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', lg: '3fr 2fr' },
            gap: { base: '2', md: '3' },
            flex: '1',
            minH: '400px'
          })}
        >
          {/* Graph */}
          <div
            className={css({
              bg: '#111',
              borderRadius: 'lg',
              border: '1px solid #222',
              p: { base: '2', md: '3' },
              display: 'flex',
              flexDirection: 'column',
              w: '100%'
            })}
          >
            <div className={css({ flex: '1', minH: '250px', w: '100%' })}>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart
                  data={sourceData}
                  margin={{ top: 8, right: 0, left: 0, bottom: 8 }}
                >
                  <CartesianGrid
                    strokeDasharray='3 3'
                    stroke='#2a2a2a'
                    vertical={false}
                  />
                  <XAxis
                    dataKey='source'
                    tick={{ fontSize: '14px', fill: '#d1d5db' }}
                    axisLine={false}
                    tickLine={false}
                    height={40}
                  />
                  <YAxis
                    tick={{ fontSize: '14px', fill: '#d1d5db' }}
                    axisLine={false}
                    tickLine={false}
                    width={0}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                    contentStyle={{
                      backgroundColor: '#111',
                      border: '1px solid #333',
                      borderRadius: '0.5rem',
                      color: '#f9fafb',
                      fontSize: 14
                    }}
                    formatter={value => [formatNumber(value), 'Definitions']}
                  />
                  <Bar
                    dataKey='definitions'
                    fill='url(#barGradient)'
                    radius={[6, 6, 0, 0]}
                  />
                  <defs>
                    <linearGradient
                      id='barGradient'
                      x1='0'
                      y1='0'
                      x2='0'
                      y2='1'
                    >
                      <stop offset='0%' stopColor='#ffffff' stopOpacity={0.9} />
                      <stop
                        offset='100%'
                        stopColor='#ffffff'
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Endpoints */}
          <div
            className={css({
              bg: '#111',
              borderRadius: 'lg',
              border: '1px solid #222',
              p: { base: '2', md: '3' },
              display: 'flex',
              flexDirection: 'column'
            })}
          >
            <h3
              className={css({
                fontSize: { base: 'md', md: 'lg' },
                fontWeight: 'bold',
                mb: { base: '2', md: '3' },
                color: '#f1f5f9'
              })}
            >
              API Endpoints
            </h3>
            <div
              className={css({
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                gap: '2',
                overflowY: 'auto',
                maxH: '450px'
              })}
            >
              {endpoints.map((endpoint, index) => (
                <div
                  key={index}
                  className={css({
                    bg: '#1a1a1a',
                    border: '1px solid #2a2a2a',
                    borderRadius: 'md',
                    p: '3',
                    transition: 'all 0.2s'
                  })}
                >
                  {/* HEADER */}
                  <div
                    onClick={() => {
                      handleCopy(endpoint, index)
                      toggleExpand(index)
                    }}
                    className={css({ cursor: 'pointer' })}
                    title='Click to copy full URL'
                  >
                    <div
                      className={css({
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3',
                        mb: '2'
                      })}
                    >
                      <span
                        className={css({
                          bg: '#333',
                          color: '#e5e7eb',
                          px: '2',
                          py: '1',
                          borderRadius: 'sm',
                          fontSize: { base: 12, md: 14 },
                          fontWeight: 'bold',
                          minW: '12',
                          textAlign: 'center'
                        })}
                      >
                        {endpoint.method}
                      </span>
                      <div className={css({ flex: '1', minW: 0 })}>
                        <code
                          className={css({
                            fontFamily: 'mono',
                            fontSize: { base: 13, md: 15 },
                            color: '#f1f5f9',
                            wordBreak: 'break-all'
                          })}
                          dangerouslySetInnerHTML={{
                            __html: renderPathWithColors(endpoint.path)
                          }}
                        />
                      </div>
                      {copiedIndex === index ? (
                        <Check
                          className={css({ w: '4', h: '4', color: '#10b981' })}
                        />
                      ) : (
                        <Copy
                          className={css({ w: '4', h: '4', color: '#6b7280' })}
                        />
                      )}
                    </div>
                    <div
                      className={css({
                        fontSize: { base: 12, md: 14 },
                        color: '#9ca3af',
                        lineHeight: 'relaxed'
                      })}
                    >
                      {endpoint.desc}
                    </div>
                  </div>

                  {/* BODY + EXAMPLE */}
                  {expandedIndex === index && (
                    <>
                      {renderBodySchema(endpoint.body)}
                      {renderExampleSchema(endpoint.example)}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sources */}
        <div
          className={css({
            textAlign: 'center',
            pt: '3',
            borderTop: '1px solid #222'
          })}
        >
          <div
            className={css({
              mb: '2',
              fontSize: { base: 'sm', md: 'md' },
              fontWeight: 'medium',
              color: '#f1f5f9'
            })}
          >
            Available Sources
          </div>
          <div
            className={css({
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1.5',
              mb: '2'
            })}
          >
            {sourceData.map((source, index) => (
              <span
                key={index}
                className={css({
                  bg: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  px: '3',
                  py: '1',
                  borderRadius: 'md',
                  fontSize: { base: 'xs', md: 'sm' },
                  color: '#d1d5db',
                  fontFamily: 'mono'
                })}
              >
                {source.source}
              </span>
            ))}
          </div>
          <div
            className={css({
              fontSize: { base: 'xs', md: 'sm' },
              color: '#ce4257',
              fontFamily: 'mono'
            })}
          >
            {serverUrl}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DictionaryCharts
