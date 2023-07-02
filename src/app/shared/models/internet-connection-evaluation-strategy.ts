/**
 * In this setting, I can adjust how the application determines whether I have a internet connection.
 * This information is useful for adjusting what content should be shown to me. For example, without internet connection
 * I would prefer offline content.
 *
 * For example, if I am sitting in a train in Germany, I would like the application to notice that
 * I am on a cellular connection and not show me any content that requires an internet connection
 * because the cellular connection there is unreliable.
 */
export type InternetConnectionEvaluationStrategy =
  | 'considerInternetUnavailable'
  | 'considerInternetAvailableWhenUsingWlan'
  | 'considerInternetAvailable';
