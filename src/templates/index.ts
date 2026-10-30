import type { Template } from '../types';
import { classicWhite } from './classicWhite';
import { filmStrip } from './filmStrip';
import { pastel } from './pastel';
import { vintageSepia } from './vintageSepia';
import { minimalBorder } from './minimalBorder';
import { cutePlayful } from './cutePlayful';
import { floralSage } from './floralSage';
import { floralRose } from './floralRose';

/**
 * All available templates, in picker order.
 *
 * To add a new template: create a `src/templates/yourTemplate.ts` file
 * exporting a `Template` object (see `src/types.ts` for the shape — you
 * can reuse `defaultSlotLayout()` from `src/lib/layout.ts` for standard
 * 4:3 slot geometry, or author custom `slots`/`caption` rects), then add
 * one line importing and listing it below. No other code changes needed —
 * the template picker, thumbnails, and compositor all read from this list.
 */
export const templates: Template[] = [
  classicWhite,
  filmStrip,
  pastel,
  vintageSepia,
  minimalBorder,
  cutePlayful,
  floralSage,
  floralRose,
];
