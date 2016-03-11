///<reference path="../node_modules/angular2/typings/browser.d.ts"/>

import {bootstrap} from 'angular2/platform/browser'
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS} from 'angular2/router';
import { enableProdMode } from "angular2/core";
enableProdMode();

import {AppComponent} from './app.component';
import {SearchService} from './services/search.service';
import {RoleTypesService} from './services/role-types.service';
import {ServiceUris} from './services/service-uris.service';

bootstrap(AppComponent, [HTTP_PROVIDERS, ROUTER_PROVIDERS, SearchService, RoleTypesService, ServiceUris]);