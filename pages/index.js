import Layout from "../layouts/index";
import getNotionData from "../data/notion";
import { useState, useEffect } from "react";


export default function Page({ sections, etag }) {
  const focused = useFocus();
  useEffect(
    () => {
      if (focused) {
        fetch(window.location, {
          headers: {
            pragma: "no-cache"
          }
        }).then(res => {
          if (res.ok && res.headers.get("x-version") != etag) {
            window.location.reload();
          }
        });
      }
    },
    [focused]
  );

  return (
    <Layout>
      {sections.map((section, i) => {
        return (
          <section
            key={`section-${i}`}
            className={i === 0 ? "intro" : ""}
            id={i === 1 ? "first" : ""}
          >
            <header>
              {i === 0 ? (
                <>
                  <h1>{renderText(section.title)}</h1>
                  {section.children[0] &&
                  section.children[0].type === "text" ? (
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
              {section.children.map(subsection =>
                subsection.type === "image" ? (
                  <span className={`image ${i === 0 ? "fill" : "main"}`}>
                    <NotionImage src={subsection.src} />
                  </span>
                ) : subsection.type === "text" ? (
                  <p>{renderText(subsection.value)}</p>
                ) : subsection.type === "list" ? (
                  <ul>
                    {subsection.children.map(child => (
                      <li>{renderText(child)}</li>
                    ))}
                  </ul>
                ) : null
              )}
            </div>
          </section>
        );
      })}
      <section>
        <header>
          <h2>Get Started</h2>
        </header>
        <div className="content">
          <p>Get started with Now + Next.js</p>
          <ul className="actions">
            <li>
              <a
                href="https://zeit.co"
                target="_blank"
                className="button primary large"
              >
                Get Started
              </a>
            </li>
            <li>
              <a
                href="https://zeit.co/blog/serverless-pre-rendering"
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
        Created by{" "}
        <a href="https://zeit.co" target="_blank">
          ZEIT
        </a>{" "}
        &mdash; Template Design by:{" "}
        <a href="https://html5up.net/license">HTML5 UP</a>.
      </div>
    </Layout>
  );
}

Page.getInitialProps = async ({ res }) => {
  const sections = await getNotionData();
  const etag = require("crypto")
    .createHash("md5")
    .update(JSON.stringify(sections))
    .digest("hex");

  if (res) {
    res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
    res.setHeader("X-version", etag);
  }

  return { sections, etag };
};

function renderText(title) {
  return title.map(chunk => {
    let wrapper = <span>{chunk[0]}</span>;

    (chunk[1] || []).forEach(el => {
      wrapper = React.createElement(el[0], {}, wrapper);
    });

    return wrapper;
  });
}

function NotionImage({ src }) {
  if (src) {
    return <img title="image" src={src} />;
  } else {
    return <div />;
  }
}

const useFocus = () => {
  const [state, setState] = useState(null);
  const onFocusEvent = event => {
    setState(true);
  };
  const onBlurEvent = event => {
    setState(false);
  };
  useEffect(() => {
    window.addEventListener("focus", onFocusEvent);
    window.addEventListener("blur", onBlurEvent);
    return () => {
      window.removeEventListener("focus", onFocusEvent);
      window.removeEventListener("blur", onBlurEvent);
    };
  });
  return state;
};
