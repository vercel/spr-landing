import Head from "next/head";

function Layout({ children }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no"
        />
        <link href="/static/main.css" rel="stylesheet" />
      </Head>

      <div id="wrapper">{children}</div>
    </>
  );
}

export default Layout;
