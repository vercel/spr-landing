import Layout from "../layouts/index";
import getNotionData from "../data/notion";

function renderText(title) {
  return title.map(chunk => {
    if (chunk[1] !== undefined && chunk[1][0] === "b") {
      return <b>{chunk[0]}</b>;
    } else {
      return <span>{chunk[0]}</span>;
    }
  });
}

function NotionImage({ src }) {
  if (src) {
    return <img title="image" src={src} />;
  } else {
    return <div />;
  }
}

export default function Page({ sections }) {
  return (
    <Layout>
      {sections.map((section, i) => {
        return (
          <section
            className={i === 0 ? "intro" : ""}
            id={i === 1 ? "first" : ""}
          >
            <header>
              {i === 0 ? (
                <>
                  <h1>{renderText(section.title)}</h1>
                  <ul class="actions">
                    <li>
                      <a href="#first" class="arrow scrolly">
                        <span class="label">Next</span>
                      </a>
                    </li>
                  </ul>
                </>
              ) : (
                <h2>{renderText(section.title)}</h2>
              )}
              {i === 0 &&
              section.children[1] &&
              section.children[1].type === "text" ? (
                <p>{renderText(section.children[1].value)}</p>
              ) : null}
            </header>
            <div class="content">
              {console.log(section.title, section.children)}
              {section.children.map(subsection =>
                subsection.type === "image" ? (
                  <span className={`image ${i === 0 ? "fill" : "main"}`}>
                    <NotionImage src={subsection.src} />
                  </span>
                ) : subsection.type === "text" ? (
                  <p>{renderText(subsection.value)}</p>
                ) : null
              )}
            </div>
          </section>
        );
      })}
      <section>
        <header>
          <h2>Duis sed adpiscing veroeros amet</h2>
        </header>
        <div class="content">
          <p>Get started with Now + Next.js</p>
          <ul class="actions">
            <li>
              <a href="#" class="button primary large">
                Get Started
              </a>
            </li>
            <li>
              <a href="#" class="button large">
                Learn More
              </a>
            </li>
          </ul>
        </div>
      </section>
      <div class="copyright">
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
  if (res) {
    res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
  }

  return { sections: await getNotionData() };
};
