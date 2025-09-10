import { Copy } from 'lucide-react'
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
  const sourceData = [
    { source: 'Wiktionary', definitions: 572727 },
    { source: 'Universalis', definitions: 47811 },
    { source: 'Cordial', definitions: 39545 },
    { source: 'Larousse', definitions: 990992 },
    { source: 'LeDictionary', definitions: 339440 },
    { source: 'Robert', definitions: 108488 }
  ]

  const generalStats = [
    { metric: 'Total Definitions', value: 2099003 },
    { metric: 'Words with Definition', value: 461244 },
    { metric: 'Avg Definitions/Word', value: (2099003 / 461244).toFixed(1) }
  ]

  const endpoints = [
    { method: 'GET', path: '/words/{word}/count', desc: 'Definition count' },
    {
      method: 'GET',
      path: '/words/{word}/definition?source={src}',
      desc: 'Definition by source'
    },
    { method: 'GET', path: '/words/{word}/definitions', desc: 'All definitions' },
    {
      method: 'GET',
      path: '/definitions/contains?word={word}',
      desc: 'Search containing word'
    },
    {
      method: 'GET',
      path: '/definitions/length?min={x}&max={y}',
      desc: 'Filter by length'
    },
    {
      method: 'GET',
      path: '/definitions/source/{source}/random',
      desc: 'Random by source'
    },
    { method: 'GET', path: '/stats', desc: 'General statistics' },
    { method: 'GET', path: '/stats/sources', desc: 'Source comparison' }
  ]

  const constraints = [
    { metric: 'Rate Limit', value: '1000 req/hour' },
    { metric: 'Burst Limit', value: '30 req/minute' },
    { metric: 'Note', value: 'Limits improve over time' }
  ]

  const formatNumber = value =>
    typeof value === 'number'
      ? new Intl.NumberFormat('en-US').format(value)
      : value

  return (
    <div
      className={css({
        bg: 'radial-gradient(circle at top, #111 0%, #000 100%)',
        color: '#f1f5f9',
        minHeight:'100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: '4',
        px: { base: '2', md: '6' },
        overflow: 'hidden'
      })}
    >
      <div
        className={css({
          bg: '#0a0a0a',
          borderRadius: '2xl',
          p: { base: '4', md: '6' },
          minHeight: '90%',
          shadow: '2xl',
          border: '1px solid #222',
          w: '100%',
          maxW: '1400px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: { base: '4', md: '6' }
        })}
      >
        <h1
          className={css({
            fontSize: { base: 'xl', md: '2xl' },
            fontWeight: 'bold',
            textAlign: 'center',
            color: 'gray',
            mb: '2'
          })}
        >
          DEF API
        </h1>

        <div
          className={css({
            display: 'flex',
            minHeight:'auto',

            justifyContent: 'center',
            gap: { base: '2', md: '4' },
            overflowX: 'auto',
            flexWrap: { base: 'wrap', md: 'nowrap' },
            py: '1'
          })}
        >
          {constraints.concat(generalStats).map((item, index) => (
            <div
              key={index}
              className={css({
                bg: '#1a1a1a',
                border: '1px solid #2a2a2a',
                px: { base: '2', md: '4' },
                py: { base: '2', md: '3' },
                borderRadius: 'lg',
                textAlign: 'center'
              })}
            >
              <span
                className={css({
                  fontSize: { base: '10px', md: 'xs' },
                  color: '#9ca3af',
                  display: 'block',
                  lineHeight: 'tight'
                })}
              >
                {item.metric}
              </span>
              <span
                className={css({
                  fontSize: { base: '11px', md: 'sm' },
                  fontWeight: 'bold',
                  fontFamily: 'mono',
                  lineHeight: 'tight'
                })}
              >
                {formatNumber(item.value)}
              </span>
            </div>
          ))}
        </div>

        <div
          className={css({
            display: 'flex',
            flexDirection: { base: 'column', lg: 'row' },
            justifyContent: 'space-between',
            gap: { base: '4', md: '6' },
            flex: '1',
            h: '100%'
          })}
        >
          <div className={css({ flex: '1', h: 'fill-content' })}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sourceData.sort((a, b) => b.definitions - a.definitions)}
                margin={{ top: 20, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#2a2a2a"
                  vertical={false}
                />
                <XAxis
                  dataKey="source"
                  tick={{ fontSize: 12, fill: '#d1d5db' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#d1d5db' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{
                    backgroundColor: '#111',
                    border: '1px solid #333',
                    borderRadius: '0.5rem',
                    color: '#f9fafb'
                  }}
                />
                <Bar
                  dataKey="definitions"
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9ca3af" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#111" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div
            className={css({
              flex: '1',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '2',
              overflowY: 'auto',
              h: '100%'
            })}
          >
            <h3
              className={css({
                fontSize: { base: 'md', md: 'lg' },
                fontWeight: '600',
                mb: '2',
                textAlign: 'center',
                color: '#e5e7eb'
              })}
            >
              API Endpoints
            </h3>
            {endpoints.map((endpoint, index) => (
              <div
                key={index}
                className={css({
                  display: 'flex',
                  flexDirection: { base: 'column', md: 'row' },
                  alignItems: { base: 'flex-start', md: 'center' },
                  justifyContent: 'space-between',
                  gap: { base: '2', md: '3' },
                  bg: '#111',
                  p: { base: '2', md: '3' },
                  borderRadius: 'md',
                  border: '1px solid #1f1f1f',
                  _hover: { bg: '#151515' },
                  transition: 'background 0.2s',
                  cursor: 'pointer'
                })}
                onClick={() => navigator.clipboard.writeText(endpoint.path)}
                title="Click to copy"
              >
                <span
                  className={css({
                    bg: '#333',
                    color: '#e5e7eb',
                    px: '2',
                    py: '0.5',
                    borderRadius: 'md',
                    fontSize: { base: '2xs', md: 'xs' },
                    fontWeight: 'bold',
                    minW: '12'
                  })}
                >
                  {endpoint.method}
                </span>
                <code
                  className={css({
                    fontFamily: 'mono',
                    color: '#f1f5f9',
                    fontSize: { base: 'xs', md: 'sm' },
                    flex: '1'
                  })}
                >
                  {endpoint.path}
                </code>
                <span
                  className={css({
                    color: '#9ca3af',
                    fontSize: { base: 'xs', md: 'sm' },
                    flex: '1'
                  })}
                >
                  {endpoint.desc}
                </span>
                <Copy
                  className={css({
                    w: '4',
                    h: '4',
                    color: '#6b7280',
                    _hover: { color: '#9ca3af' }
                  })}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DictionaryCharts