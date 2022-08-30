export type LanguageSubscription = (ids: string[]) => void
export type Unsubscribe = () => void
export type LanguageSubscribe = (subscription: LanguageSubscription) => Unsubscribe

export interface SelectedLanguageIdsBus {
  onSelectedIdsChange: (ids: string[]) => void
  subscribeSelectedIds: LanguageSubscribe
}

/**
 * We need a way to communicate state changes between the pane menu and input components.
 * LanguageFilter button lives outside the input-render tree, so Context is out.
 * This is a workaround for that.
 */
export function createSelectedLanguageIdsBus(): SelectedLanguageIdsBus {
  const subs: LanguageSubscription[] = []

  const onSelectedIdsChange = (ids: string[]) => {
    subs.forEach((s) => s(ids))
  }
  const subscribeSelectedIds = (subscription: LanguageSubscription) => {
    subs.push(subscription)
    return () => {
      subs.splice(subs.indexOf(subscription), 1)
    }
  }

  return {
    onSelectedIdsChange,
    subscribeSelectedIds,
  }
}
