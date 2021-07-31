const React = require("react")

module.exports = function(props){
  return (
    <html lang="es" dir="ltr">
      <head>
        <meta charSet="utf-8"/>
        <title>Admin panel</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link rel="stylesheet" href="/styles.css"/>
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet"/>
      </head>
      <body>
        <nav>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/logout">Salir</a>
            </li>
          </ul>
        </nav>
        {props.children}
      </body>
    </html>
  )
}
