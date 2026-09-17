import { UsFlagIcon } from "@/icons";
export const locales = ["en"];
export const defaultLocale = "en";
export const languages = [
    {
        id: "en",
        name: "English",
        shortName: "English",
        dir: "ltr",
        FlagIcon: UsFlagIcon,
    },
    // {
    //   id: "ar",
    //   name: "Arabic (Saudi)",
    //   shortName: "Arabic",
    //   dir: "rtl",
    //   FlagIcon: SaFlagIcon,
    //   badge: "RTL",
    // },
    // {
    //   id: "es",
    //   name: "Español",
    //   shortName: "Español",
    //   dir: "ltr",
    //   FlagIcon: EsFlagIcon,
    // },
    // {
    //   id: "de",
    //   name: "Deutsch",
    //   shortName: "Deutsch",
    //   dir: "ltr",
    //   FlagIcon: DeFlagIcon,
    // },
];
export function getLanguage(locale) {
    return languages.find((l) => l.id === locale) || languages[0];
}
export function isRtl(locale) {
    return getLanguage(locale).dir === "rtl";
}
