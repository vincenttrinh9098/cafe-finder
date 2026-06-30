import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";

window.HTMLElement.prototype.scrollIntoView = vi.fn();