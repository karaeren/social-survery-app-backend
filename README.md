# Social Survey App Backend

"Social Survey App" projesi, **backend** tarafı. Node.js ile yazılmakta.

[Live Api @ https://socialsurveyapp.software/api/v1/](https://socialsurveyapp.software/api/v1/)

[Live Swagger Docs @ https://socialsurveyapp.software/api/v1/docs](https://socialsurveyapp.software/api/v1/docs)

(id: admin, pw: isütez)

# Kurulum

Sistemde [Node.js](https://nodejs.org/en/download/) >=12.0.0 sürümü ve [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) paket yöneticisi kurduktan sonra, projenin bulunduğu dizindeki bir terminalden `yarn` yazarak gerekli paketleri kurup `yarn dev` ile projeyi development modunda ayağa kaldırabilir veya `yarn start` yazarak production modunda ayağa kaldırabilirsiniz.

Bir domain üzerinden sunmak için Nginx kurup, [örnek](https://github.com/karaeren/social-survery-app-backend/blob/master/nginx.example.conf) konfigürasyon dosyasını domaine özel şekilde ayarlamak yeterli olacaktır. Ayrıca Let's Encrypt ile `sudo certbot --nginx -d domain.uzantı -d www.domain.uzantı` ile SSL sertifikası da kolayca alınabilir.

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

* [Ubuntu (20.04) üzerinden Nginx kurmak için gereken adımlar](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04)
* [Ubuntu (20.04) üzerinde Let's Encrypt için gereken adımlar](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-20-04)
