import {AppConfig} from "@/utils/constants/App";

const defaultTitle = AppConfig.APP_NAME

const withTitleSuffix = (title: string) => `${title} | ${defaultTitle}`

export const Meta = {
  default: {
    title: defaultTitle
  },
  login: {
    title: withTitleSuffix("Login")
  }
}
