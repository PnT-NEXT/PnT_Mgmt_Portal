# PnT_Mgmt_Portal

- Environment Setup

    If you are new or your env have been changed, please follow the checklist to start.
    
   * CheckList for newer:
      1. Install MongoDB: https://www.mongodb.org/downloads
         After installed the application, you need to add your mongo work dir(C:\Program Files\MongoDB\Server\3.0\bin) into System Path.
      2. Install Node.js: https://nodejs.org/en/download/
          the application will add the nodejs into the path automaticlly. If not, please add it.(C:\Program Files\nodejs)
      3. Choose one of the IDE what you like: (webstorm, brackets, sublime)
      4. Get our code from the git hub. Because we have different environment, we can use the git application to Clone the code from the Git Server.
      5. Set Proxy. http://digitaldrummerj.me/proxy-configurations/
          a. set http proxy (if you network not at home)
          b. NPM
          c. Git
          d. Bowder (intall it at your work directory) >npm install bower -g
      6. Start DB. open cmd, then input: >mongod
      7. Start NodeJs Server, on your work dir, press Shift + (Right Mouse Click ) to open cmd, input: >node server.js
          a. You can install the nodemon whose functionality is restart node server automaticaly >npm install nodemon -g
          b. set node_env=dev
          c. >nodemon server.js
      8. Open your browser, visit our site via "http://localhost:3000".
    
    * DB Operation:
      1.  enter into the mongo >mongo
      2.  >show dbs
      3.  >use db_name
      4.  >show collections
      5.  >db.doc_name.find()
      6.  >db.doc_name.remove({})
