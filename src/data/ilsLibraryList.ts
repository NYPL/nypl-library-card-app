import { LibraryListObject } from "../interfaces";
import libraryNamesAr from "./libraryNamesAr";
import libraryNamesBn from "./libraryNamesBn";
import libraryNamesEn from "./libraryNamesEn";
import libraryNamesEs from "./libraryNamesEs";
import libraryNamesFr from "./libraryNamesFr";
import libraryNamesHt from "./libraryNamesHt";
import libraryNamesKo from "./libraryNamesKo";
import libraryNamesPl from "./libraryNamesPl";
import libraryNamesRu from "./libraryNamesRu";
import libraryNamesUr from "./libraryNamesUr";
import libraryNamesZhcn from "./libraryNamesZhcn";

const ilsLibraryList: { [key: string]: LibraryListObject[] } = {
  ar: libraryNamesAr,
  bn: libraryNamesBn,
  en: libraryNamesEn,
  es: libraryNamesEs,
  fr: libraryNamesFr,
  ht: libraryNamesHt,
  ko: libraryNamesKo,
  pl: libraryNamesPl,
  ru: libraryNamesRu,
  ur: libraryNamesUr,
  zhcn: libraryNamesZhcn,
};

export default ilsLibraryList;
