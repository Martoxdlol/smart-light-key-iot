const fs = require("fs")
const awaitExec = require('await-exec')
const Client = require('ssh2-sftp-client');
const sftp = new Client();
const path = require("path")

const KEY_PATH = 'C:\\users\\tomas\\secure_keys\\interr2_key.pem'
const HOST = '104.41.45.219'
const USERNAME = 'martoxdlol'
const HOME_DIR = '/home/martoxdlol/'
const PROJECT_DIR = HOME_DIR+'interr2/'

//cd /tmp/
//mkdir /tmp/install
//cd /tmp/install
//wget https://deb.nodesource.com/setup_14.x
//sudo bash nodesource_setup.sh
//sudo apt-get install -y nodejs
//sudo npm install -g pm2
//sudo wget https://nginx.org/keys/nginx_signing.key
//sudo apt install redis-server

//HACER ESTO: https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/#prebuilt_ubuntu

//nginx config ...
//sudo rm /etc/nginx/sites-enabled/default
//sudo nano /etc/nginx/sites-available/iot.abcd.ar
//sudo ln -s /etc/nginx/sites-available/iot.abcd.ar /etc/nginx/sites-enabled/
//sudo nano /etc/nginx/sites-available/app.iot.abcd.ar
//sudo ln -s /etc/nginx/sites-available/app.iot.abcd.ar /etc/nginx/sites-enabled/
//sudo nano /etc/nginx/sites-available/admin.iot.abcd.ar
//sudo ln -s /etc/nginx/sites-available/admin.iot.abcd.ar /etc/nginx/sites-enabled/

//sudo add-apt-repository ppa:certbot/certbot
//sudo apt install python-certbot-nginx

//sudo certbot --nginx -d iot.abcd.ar -d www.iot.abcd.ar
//sudo certbot --nginx -d app.iot.abcd.ar
//sudo certbot --nginx -d admin.iot.abcd.ar


//sudo rm -r /tmp/install

async function main(){

  await sftp.connect({
    host: HOST,
    port: '22',
    username: USERNAME,
    privateKey: fs.readFileSync(KEY_PATH),
  })



  await makeIfNotExist(PROJECT_DIR)
  await makeIfNotExist(PROJECT_DIR+'frontend')
  await makeIfNotExist(PROJECT_DIR+'static-web')
  await makeIfNotExist(PROJECT_DIR+'backend')
  await makeIfNotExist(PROJECT_DIR+'backend/app')
  await makeIfNotExist(PROJECT_DIR+'backend/devices')
  await makeIfNotExist(PROJECT_DIR+'backend/update')
  await makeIfNotExist(PROJECT_DIR+'backend/admin')
  await makeIfNotExist(PROJECT_DIR+'backend/shared')

  await awaitExec('cd C:\\Users\\tomas\\Documents\\interruptor_inteligente_2020\\frontend && npm run build')


  await sftp.uploadDir(path.resolve('../backend/app'), PROJECT_DIR+'backend/app')
  await sftp.uploadDir(path.resolve('../backend/devices'), PROJECT_DIR+'backend/devices')
  await sftp.uploadDir(path.resolve('../backend/update'), PROJECT_DIR+'backend/update')
  await sftp.uploadDir(path.resolve('../backend/admin'), PROJECT_DIR+'backend/admin')
  await sftp.uploadDir(path.resolve('../backend/shared'), PROJECT_DIR+'backend/shared')
  await sftp.uploadDir(path.resolve('../public'), PROJECT_DIR+'frontend')
  await sftp.uploadDir(path.resolve('../frontend/dist'), PROJECT_DIR+'frontend')
  sftp.fastPut(path.resolve('../backend/package.json'), PROJECT_DIR+'backend/package.json'),
  sftp.fastPut(path.resolve('../backend/.babelrc'), PROJECT_DIR+'backend/.babelrc'),
  sftp.fastPut(path.resolve('../backend/info.txt'), PROJECT_DIR+'backend/info.txt'),


  awaitExec(`ssh -i ${KEY_PATH} ${USERNAME}@${HOST} "cd ${PROJECT_DIR}/backend && npm install"`)
}

main().then(process.exit).catch(e => {console.error(e);process.exit()})

async function makeIfNotExist(p){
  if(!await sftp.exists(p)) await sftp.mkdir(p,true)
}
