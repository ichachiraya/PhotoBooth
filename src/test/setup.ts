import '@testing-library/jest-dom/vitest';
import 'fake-indexeddb/auto';
import { installFakeCanvasContext, installFakeCreateImageBitmap } from './mockCanvasContext';

installFakeCanvasContext();
installFakeCreateImageBitmap();
