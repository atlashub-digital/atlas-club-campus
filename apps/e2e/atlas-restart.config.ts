import {defineConfig} from '@playwright/test'
import base from './atlas.config'
export default defineConfig({...base,testMatch:'restart.spec.ts',outputDir:'atlas-restart-results',reporter:[['list'],['html',{open:'never',outputFolder:'atlas-restart-report'}]]})
