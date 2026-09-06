import legal from './legal.json'

/** The three legal documents. Kept apart from messages.json so their text is
 *  bundled only with the routes that render it, not with the landing page. */
export const legalDocs = legal

export type LegalDocId = 'privacy' | 'terms' | 'hipaa'
export type LegalDoc = (typeof legal)[LegalDocId]
export type LegalBlock = LegalDoc['sections'][number]['blocks'][number]
