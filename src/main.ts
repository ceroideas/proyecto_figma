import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';
bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    NG_EVENT_PLUGINS,
    importProvidersFrom(HttpClientModule), // Proporciona HttpClientModule
    appConfig.providers,
  ],
}).catch((err) => console.error(err));
