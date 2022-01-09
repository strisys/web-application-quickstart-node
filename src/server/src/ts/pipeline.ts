import express from 'express';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import { apiRouter } from './api/v1';

const app = express();

export class Pipeline {
  private _server: any;

  public get port(): number {
    return app.get('port');
  }

  public configure(): Pipeline {
    // set app variables
    app.set('port', process.env.PORT || 3000);

    // configure middlware pipeline
    app.use(express.static("public"));
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(cookieParser("secret_passcode"));
    app.use(
      expressSession({
        secret: "secret_passcode",
        cookie: {
          maxAge: 4000000
        },
        resave: false,
        saveUninitialized: false
      })
    );

    app.use((req, res, next) => {
      next();
    });

    app.use(`/`, apiRouter);

    return this;
  }

  public start(): void {
    this._server = app.listen(this.port, () => {
      console.log(`Server running @ port=${this.port}`);
    })
  }
}