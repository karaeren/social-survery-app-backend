# Social Survey App Backend

"Social Survey App" projesi, **backend** tarafı. Node.js ile yazılmakta.

[Live Api @ https://socialsurveyapp.software/api/v1/](https://socialsurveyapp.software/api/v1/)

[Live Swagger Docs @ https://socialsurveyapp.software/api/v1/docs](https://socialsurveyapp.software/api/v1/docs)

(id: admin, pw: isütez)

# Kurulum

Sistemde [Node.js](https://nodejs.org/en/download/) >=12.0.0 sürümü ve [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) paket yöneticisi kurduktan sonra, projenin bulunduğu dizindeki bir terminalden `yarn` yazarak gerekli paketleri kurup `yarn dev` ile projeyi development modunda ayağa kaldırabilir veya `yarn start` yazarak production modunda ayağa kaldırabilirsiniz.

# Notlar

* Dosya dizininde ayrıca bir ".env" dosyası olmalı. Bununla ilgili örnek ".env.example" dosyasında bulunmaktadır. Bu example dosyası development aşamasında ismi değiştirilerek kullanılabilir.

* Sıfırdan kurulmuş bir konteynerda, MongoDB kullanıcı adı ve şifre oluşturmak için `docker ps` ile MongoDB konteynerının adını bulup `docker exec -it konteyner-adı bash` komutu ile konteynera shell izni alınmalıdır. Bu shellden de gerekli kullanıcı oluşturulmalıdır. Örnek adımlar;
```
docker exec -it social-survey-app-backend_mongodb_1 bash
mongo
use admin
db.createUser({user:"user", pwd:"password", roles:["root"]});
```
.env dosyasına gerekli değişkenler yazıldıktan sonra Node uygulamasının tekrar çalıştırılması (eğer Docker ile çalıştırılıyorsa konteynerların kapatılıp açılması) gerekiyor.
