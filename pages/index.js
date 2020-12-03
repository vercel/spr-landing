import Color from 'color'
import Head from 'next/head'
import Layout from '../layouts/index'
import React, { useState, useEffect } from 'react'
import getNotionData from '../lib/notion'

export default function Page({ sections, etag, meta }) {
  const focused = useFocus()
  useEffect(() => {
    if (focused) {
      fetch(window.location, {
        headers: {
          pragma: 'no-cache',
        },
      })
        .then(async (res) => {
          const text = await res.text()

          if (text.indexOf(etag) === -1) {
            window.location.reload()
          }
        })
        .catch(() => {})
    }
  }, [focused])

  const color = Color(meta.color ? meta.color[0][0] : '#49fcd4')
  const color2 = color.darken(0.4)
  const color3 = color2.lighten(0.1)

  return (
    <Layout>
      <Head>
        {meta.title && <title>{meta.title[0][0]}</title>}
        {meta.description && (
          <meta name="description" content={meta.description[0][0]} />
        )}
      </Head>

      {sections.map((section, i) => {
        return (
          <section
            key={`section-${i}`}
            className={i === 0 ? 'intro' : ''}
            id={i === 1 ? 'first' : ''}
          >
            <header>
              {i === 0 ? (
                <>
                  <h1>{renderText(section.title)}</h1>
                  {section.children[0] &&
                  section.children[0].type === 'text' ? (
                    <p>{renderText(section.children[0].value)}</p>
                  ) : null}
                  <ul className="actions">
                    <li>
                      <a href="#first" className="arrow scrolly">
                        <span className="label">Next</span>
                      </a>
                    </li>
                  </ul>
                </>
              ) : (
                <h2>{renderText(section.title)}</h2>
              )}
            </header>
            <div className="content">
              {section.children.map((subsection) =>
                subsection.type === 'image' ? (
                  <span className={`image ${i === 0 ? 'fill' : 'main'}`}>
                    <NotionImage src={subsection.src} />
                  </span>
                ) : subsection.type === 'text' ? (
                  i !== 0 && <p>{renderText(subsection.value)}</p>
                ) : subsection.type === 'list' ? (
                  i !== 0 && (
                    <ul>
                      {subsection.children.map((child) => (
                        <li>{renderText(child)}</li>
                      ))}
                    </ul>
                  )
                ) : null
              )}
            </div>
          </section>
        )
      })}
      <section>
        <header>
          <h2>Get Started</h2>
        </header>
        <div className="content">
          <p>Get started with Vercel + Next.js</p>
          <ul className="actions">
            <li>
              <a
                href="https://vercel.com"
                target="_blank"
                className="button primary large"
              >
                Get Started
              </a>
            </li>
            <li>
              <a
                href="https://vercel.com/blog/serverless-pre-rendering"
                target="_blank"
                className="button large"
              >
                Learn More
              </a>
            </li>
          </ul>
        </div>
      </section>
      <div className="copyright">
        Created by{' '}
        <a href="https://vercel.com" target="_blank">
          Vercel
        </a>{' '}
        &mdash; Template Design by:{' '}
        <a href="https://html5up.net/license">HTML5 UP</a>.
      </div>

      <style jsx global>{`
        #wrapper > section > header:before,
        #wrapper > section > header h1:after,
        #wrapper > section > header h2:after,
        #wrapper > section > header h1:before,
        #wrapper > section > header h2:before,
        #wrapper > section:last-of-type > header:after,
        input[type='submit'].primary,
        input[type='reset'].primary,
        button.primary,
        .button.primary,
        input[type='checkbox']:checked + label:before,
        input[type='radio']:checked + label:before,
        input[type='checkbox']:focus + label:before,
        input[type='radio']:focus + label:before {
          background-color: ${color3.hex()};
          border-color: ${color3.hex()};
        }

        input[type='submit']:hover,
        input[type='reset']:hover,
        input[type='button']:hover,
        button:hover,
        .button:hover {
          box-shadow: inset 0 0 0 2px ${color3.hex()};
          color: ${color3.hex()} !important;
        }

        input[type='submit'].primary:hover,
        input[type='reset'].primary:hover,
        input[type='button'].primary:hover,
        button.primary:hover,
        .button.primary:hover {
          background-color: ${color2.hex()};
          color: #000 !important;
        }

        #wrapper:before {
          background-color: ${color.hex()};
          background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 920 1750' x='0px' y='0px'%3E %3Cpath style='fill: rgba(${color2.red()}, ${color2.blue()}, ${color2.green()}, 0.25)' d='M889.72,1137.55l-2.91-0.75l-364.39,282.94l-0.7-0.9l-0.51,0.11l-94.77-451.5l-32.51-15.75l-16.73-8.11l0,0.68 l-1.46,0l0-1.39l-1.89-0.92l-112.41-54.47l-0.29,1.03l-1.41-0.37l0.37-1.31l-34.14-16.54l-98.56-47.76l-0.59,0.81l-1.16-0.88 l0.42-0.57L11.43,766.33l-0.25,0.2l-0.9-1.15l102.87-79.98l0.08-0.1l0.02,0.02l116.68-90.72l-0.18-0.34l1.3-0.66l0.05,0.09 l100.5-78.14l-0.07-0.32l0.65-0.14l42.3-32.89l-0.15-54.54l-0.59,0.29l-0.64-1.31l1.23-0.6l-0.01-4.54l-0.33-122.47l-0.99,0.18 l-0.28-1.43l1.27-0.23l-0.4-147.49l-0.87-0.16l0.28-1.43l0.58,0.1l-0.35-127.48l-0.13-0.06l0.64-1.31L489.97,76.8l0.73,0.19 l-0.04,0.14l132.63,65.11l0.33-0.45l1.16,0.88l-0.16,0.22l114.21,56.07l0.45-0.35l0.72,0.93l47.89,23.51l2.76-1.36l0.56,4.61 l-3.32-1.63L571.52,330.88L375.95,482.93l0.66,239.95l51.12,243.57l222.53,107.83l236.23,60.93l2.27-1.77 M375.8,425.34l17.25-8.47 l36.13-127.75l-53.73,9.66L375.8,425.34z M551,241.05l38.19-52.2l-123.83-22.27l-34.13,120.68l98.99-17.81L551,241.05z M532.3,269.09l151.34-27.22l37.63-29.25l-130.48-23.47L532.3,269.09z M303.38,733.9l-2.36-4.48l-44.18-83.78L182.5,747.25 l40.78,36.46l52.69,47.11L303.38,733.9z M277.18,831.91l56.95,50.93L375.69,920l-0.13-49.23l-71.19-135L277.18,831.91z M303.96,731.86l41.93-148.25l-9.74-46.39L257.8,644.33L303.96,731.86z M304.94,733.73l9.55,18.12l61.05,115.78l-0.39-144.6 l-16.9-80.53l-11.71-55.81L304.94,733.73z M375.21,211.79l0.23,85.51l54.17-9.74l34.29-121.23l-88.87-15.98L375.21,211.79z M430.78,288.83l-17.88,63.21L394.81,416l44.01-21.6l90.15-123.23L430.78,288.83z M287.76,898.62l87.99,42.64l-0.05-19.29 l-91.37-81.71l-7.59-6.78l-14.88,52.59L287.76,898.62z M174.26,843.62l86.26,41.8l15-53.03l-93.89-83.95l-53.34,72.91L174.26,843.62 z M113.18,687.22L12.71,765.33l55.69,26.99l58.56,28.38l53.58-73.24l-34.83-31.14L113.18,687.22z M230.62,595.92l-116.27,90.4 l63.02,56.36l4.03,3.61l74.67-102.08l-7.47-14.17L230.62,595.92z M331.94,517.15l-100.15,77.86l25.25,47.88l78.71-107.59l-1.71-8.14 L331.94,517.15z M333.22,516.15l2.02,9.64l1.66,7.92l34.65-47.37L333.22,516.15z M337.31,535.63l9.43,44.95l26.67-94.3 L337.31,535.63z M347.39,583.66l27.74,132.16l-0.62-228.04L347.39,583.66z M374.7,21.83l0.35,127.02l89.27,16.06l24.61-87 L374.7,21.83z M490.25,78.56l-22.26,78.7l-2.24,7.91l124.39,22.37l10.23-13.99l22.04-30.12L490.25,78.56z M623.74,144.09 l-12.29,16.8l-19.71,26.95l131.07,23.58l14.73-11.45L623.74,144.09z M739,200.67l-13.3,10.34l-0.96,0.74l58.14,10.46L739,200.67z M723.19,212.96l-25.33,19.69l-11.14,8.66l97.03-17.45L723.19,212.96z M782.89,225.5l-98.64,17.74l-107.06,83.23L782.89,225.5z M631.68,282.26l49.48-38.47l-150.1,27l-89.41,122.22l129.1-63.37L631.68,282.26z M565.06,334.05l-125.28,61.5l-45.94,62.8 l-14.96,20.44L565.06,334.05z M425.31,412.87l11.65-15.93l-42.69,20.96l-13.66,48.3l-3.58,12.67L425.31,412.87z M392.51,418.76 l-16.71,8.2l0.01,4.72l0.12,45.68L392.51,418.76z M377.21,941.96l21.37,10.36l24.14,11.7l-45.56-40.74L377.21,941.96z M377.15,921.31l34.83,31.15l12.57,11.24l-47.53-90.14L377.15,921.31z M376.63,730.07l0.38,140.33l48.29,91.59L376.63,730.07z M806.29,1197.48l75.8-58.86l-28.56,11.47l-25.6,10.28l14.96,7.25l-0.64,1.31l-16.16-7.83l-124.76,50.1l40.56,36.27L806.29,1197.48z M522.43,1146.18l58.88,111.66l52.71-21.17l64.61-25.95l-75.11-67.17L522.43,1146.18z M621.92,1142.14l-115.78-103.53l-46.8-12.07 l62.33,118.2l7.06-0.18L621.92,1142.14z M700.14,1210.12l124.19-49.87l-42.89-20.78l-155.8,4.04L700.14,1210.12z M679.7,1295.77 l61.03-47.39l-40.9-36.57l-117.85,47.32l42.09,79.82L679.7,1295.77z M522.48,1417.85l1.83-1.42l98.6-76.56l-42.28-80.19 l-84.25,33.83L522.48,1417.85z M496.08,1292.06l83.87-33.68l-59.14-112.16l-55.04,1.43L496.08,1292.06z M465.46,1146.2l54.58-1.42 l-62.61-118.74l-18.03-4.65l0.36-1.41l16.74,4.32l-27.63-52.4L465.46,1146.2z M458.42,1024.79l45.35,11.7l-74.14-66.29 L458.42,1024.79z M431.46,969.87l75.38,67.41l136.26,35.15L431.46,969.87z M649.76,1075.65l-140.54-36.25l114.83,102.68l154.53-4.01 L649.76,1075.65z M656.92,1077.5l124.84,60.5l51.97-1.35l47.7-1.24L656.92,1077.5z M784.62,1139.38l41.54,20.13l56.45-22.67 L784.62,1139.38z'/%3E %3C/svg%3E");
        }
      `}</style>
    </Layout>
  )
}

export async function getStaticProps() {
  const notionData = await getNotionData()
  const { sections, meta } = notionData

  const etag = require('crypto')
    .createHash('md5')
    .update(JSON.stringify(notionData))
    .digest('hex')

  return {
    props: {
      etag,
      meta,
      sections,
    },
    revalidate: 1,
  }
}

function renderText(title) {
  return title.map((chunk) => {
    let wrapper = <span>{chunk[0]}</span>

    ;(chunk[1] || []).forEach((el) => {
      wrapper = React.createElement(el[0], {}, wrapper)
    })

    return wrapper
  })
}

function NotionImage({ src }) {
  if (src) {
    return <img title="image" src={src} />
  } else {
    return <div />
  }
}

const useFocus = () => {
  const [state, setState] = useState(null)
  const onFocusEvent = (event) => {
    setState(true)
  }
  const onBlurEvent = (event) => {
    setState(false)
  }
  useEffect(() => {
    window.addEventListener('focus', onFocusEvent)
    window.addEventListener('blur', onBlurEvent)
    return () => {
      window.removeEventListener('focus', onFocusEvent)
      window.removeEventListener('blur', onBlurEvent)
    }
  })
  return state
}
