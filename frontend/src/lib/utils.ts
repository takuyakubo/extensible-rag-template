import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * clsxとtailwind-mergeを組み合わせたユーティリティ関数
 * 条件付きでクラスを適用するときに便利
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}