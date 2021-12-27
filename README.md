# zyno.gmail-reader
Configurable software bot to read incoming gmail email messages and process attachments

## Pre-requisites

* Google workspace App-Specific Passwords is required
* Create `docker-compose.yml` and copy and paste it from the code given below
* Configure the below 4 environment variables in `docker-compose.yml` with your credentials and modify other environment variables as per your need
    * NAME
    * EMAIL
    * USERNAME
    * PASSWORD

docker-compose.yml
```bash
version: "3.7"

services:
  zyno.gmail-reader:
    container_name: zyno.gmail-reader
    image: senthilsweb/zyno.gmail-reader:latest
    command: node app.js
    environment:
      - NAME=
      - EMAIL=
      - USERNAME=
      - PASSWORD=
      - IMAP_HOST=imap.gmail.com
      - IMAP_PORT=993
      - IMAP_TLS=true
      - SMTP_HOST=smtp.gmail.com
      - SMTP_SSL=true
      - EMAIL_SEARCH_FILTER_SINCE='Dec 25, 2021'
      - EMAIL_SEARCH_FILTER_BEFORE='Dec 31, 2021'
      - EMAIL_ATTACHMENT_EXT_ALLOWED=.pdf|.csv|.xls|.xlsx
      - EMAIL_MESSAGES_DIRECTORY=/emails/messages/
      - EMAIL_ATTACHMENTS_DIRECTORY=/emails/attachments/
    volumes:
        - ./emails:/usr/src/emails
    restart: unless-stopped
    tty: true
```

## Run using docker-compose

```
docker-compose up
```

## References

### How to create google App-Specific Passwords?

* Go to [https://myaccount.google.com](https://myaccount.google.com/) and Login 
* Click On Security
* Enable 2-Step Verification under Signing into Google
* Click App passwords (and sign in again)
* On the App Passwords screen use the drop downs to select the following:
    * Select app (Select the app this password will be for)
    * Select Device (Select the device this app will be for)
* Once you have selected the above settings click the GENERATE button.
* Your new password will be randomly generated and displayed on your screen.
* Copy it down somewhere for safekeeping as you only get to see this once. `If you lose this password you’ll need to generate a new one!`
* Take your new password and use it in place of your regular password when signing in to a Less Secure App. Using this password will let you continue using the app like normal and the best part is most of the time you will only need to enter it once to have it saved!