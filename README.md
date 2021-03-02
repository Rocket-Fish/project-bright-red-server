# xivQueue

Note This project is only really using docker for setting up an easy postgres DB, run app outside of docker for best dev experience

### development

```
docker-compose up postgres
```

then run DB migrations

```
npm run migration
```

run db seed

```
npm run seed
```

dev

```
npm run dev
```
