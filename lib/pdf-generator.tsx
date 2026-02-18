// Server-only — do NOT import in client components
import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from '@react-pdf/renderer'

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    color: '#1e293b',
    lineHeight: 1.65,
    paddingTop: 0,
    paddingBottom: 60,
    paddingHorizontal: 55,
  },

  // Top blue accent stripe
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: '#2563eb',
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    marginTop: 28,
    marginBottom: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  brandName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: '#1e40af',
    letterSpacing: 1.5,
  },
  brandTagline: {
    fontSize: 7.5,
    color: '#64748b',
    marginTop: 2,
  },
  headerDate: {
    fontSize: 8,
    color: '#94a3b8',
    textAlign: 'right',
  },
  headerRule: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginBottom: 20,
  },

  // ── Title ───────────────────────────────────────────────────────────────────
  titleBlock: {
    marginBottom: 22,
    paddingBottom: 18,
    borderBottomWidth: 1.5,
    borderBottomColor: '#2563eb',
  },
  titleText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 17,
    color: '#0f172a',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  titleSubtext: {
    fontSize: 8.5,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 5,
  },

  // ── Body content ────────────────────────────────────────────────────────────
  spacer: {
    height: 6,
  },
  sectionHeader: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.5,
    color: '#1d4ed8',
    marginTop: 14,
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  body: {
    fontSize: 9.5,
    color: '#1e293b',
    lineHeight: 1.65,
    marginBottom: 1.5,
  },
  indented: {
    marginLeft: 14,
  },
  bulletRow: {
    flexDirection: 'row',
    marginLeft: 14,
    marginBottom: 1.5,
  },
  bulletDot: {
    fontSize: 9.5,
    color: '#2563eb',
    marginRight: 5,
    lineHeight: 1.65,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    color: '#1e293b',
    lineHeight: 1.65,
  },
  // Compound styles for indented body text
  bodyIndented: {
    fontSize: 9.5,
    color: '#1e293b',
    lineHeight: 1.65,
    marginBottom: 1.5,
    marginLeft: 14,
  },

  // ── Placeholder highlight ───────────────────────────────────────────────────
  placeholder: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    fontFamily: 'Helvetica-Oblique',
  },

  // ── Signature block ─────────────────────────────────────────────────────────
  signatureSection: {
    marginTop: 24,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  signatureParty: {
    width: '60%',
  },
  signatureDate: {
    width: '34%',
  },
  signatureLabel: {
    fontSize: 8,
    color: '#64748b',
    marginBottom: 14,
    fontFamily: 'Helvetica-Bold',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#94a3b8',
    marginBottom: 4,
    height: 20,
  },
  signatureCaption: {
    fontSize: 7.5,
    color: '#94a3b8',
    fontFamily: 'Helvetica-Oblique',
  },

  // ── Footer ──────────────────────────────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 22,
    left: 55,
    right: 55,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: '#e2e8f0',
    paddingTop: 7,
  },
  footerLeft: {
    fontSize: 7.5,
    color: '#94a3b8',
  },
  footerRight: {
    fontSize: 7.5,
    color: '#94a3b8',
  },
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Split a string into segments, isolating [BRACKET PLACEHOLDERS]
function splitPlaceholders(text: string): Array<{ text: string; isPlaceholder: boolean }> {
  const parts = text.split(/(\[[^\]]+\])/g)
  return parts
    .filter((p) => p.length > 0)
    .map((p) => ({
      text: p,
      isPlaceholder: p.startsWith('[') && p.endsWith(']'),
    }))
}

// Render a text line with placeholder highlighting
function renderTextWithPlaceholders(
  text: string,
  baseStyle: (typeof styles)[keyof typeof styles],
  key: string
) {
  const segments = splitPlaceholders(text)
  if (segments.length === 1 && !segments[0].isPlaceholder) {
    return (
      <Text key={key} style={baseStyle}>
        {text}
      </Text>
    )
  }
  return (
    <Text key={key} style={baseStyle}>
      {segments.map((seg, i) =>
        seg.isPlaceholder ? (
          <Text key={i} style={styles.placeholder}>
            {seg.text}
          </Text>
        ) : (
          <Text key={i}>{seg.text}</Text>
        )
      )}
    </Text>
  )
}

// Detect line types
function isNumberedSection(line: string): boolean {
  return /^\d+(\.\d+)?\.(\s|$)/.test(line.trim())
}

function isAllCapsHeading(line: string): boolean {
  const t = line.trim()
  return (
    t.length >= 3 &&
    /^[A-Z][A-Z\s&/–-]+$/.test(t) &&
    !t.includes('_') &&
    !/^\d/.test(t)
  )
}

function isBulletLine(line: string): boolean {
  return /^\s*-\s/.test(line)
}

function isSubItemLine(line: string): boolean {
  return /^\s*\([a-z]\)\s/.test(line)
}

function isIndentedLine(line: string): boolean {
  return line.startsWith('  ') || line.startsWith('\t')
}

function isSignatureLine(line: string): boolean {
  return line.includes('___')
}

// ─── Signature block component ────────────────────────────────────────────────

function SignatureBlock({ partyLabel, nameLabel }: { partyLabel: string; nameLabel: string }) {
  return (
    <View style={styles.signatureRow}>
      <View style={styles.signatureParty}>
        <Text style={styles.signatureLabel}>{partyLabel}</Text>
        <View style={styles.signatureLine} />
        <Text style={styles.signatureCaption}>{nameLabel}</Text>
      </View>
      <View style={styles.signatureDate}>
        <Text style={styles.signatureLabel}>Date</Text>
        <View style={styles.signatureLine} />
      </View>
    </View>
  )
}

// ─── Content renderer ─────────────────────────────────────────────────────────

function renderContentLines(lines: string[]): React.ReactElement[] {
  const elements: React.ReactElement[] = []
  let inSignatureSection = false
  let signaturesRendered = false
  // We'll accumulate signature party names from lines like "[YOUR NAME]"
  const signatureParties: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]
    const trimmed = raw.trim()

    // ── Empty line ──────────────────────────────────────────────────────────
    if (!trimmed) {
      elements.push(<View key={`spacer-${i}`} style={styles.spacer} />)
      continue
    }

    // ── Signature section detection ─────────────────────────────────────────
    if (trimmed === 'SIGNATURES' || trimmed === 'SIGNATURE') {
      inSignatureSection = true
      elements.push(
        <View key={`sig-section-${i}`} style={styles.signatureSection}>
          <Text style={styles.sectionHeader}>Signatures</Text>
        </View>
      )
      continue
    }

    if (inSignatureSection) {
      // Skip signature underline lines
      if (isSignatureLine(trimmed)) continue

      // Collect party label lines like "Freelancer:", "Client:", "Party A:", "Party B:", etc.
      if (/^(Freelancer|Client|Party [AB]|Developer|Designer|Producer|Party):/i.test(trimmed)) {
        // Extract the name after the colon if present, or use next lines
        const colonIdx = trimmed.indexOf(':')
        const label = trimmed.slice(0, colonIdx).trim()
        // Peek at next line for the [NAME] placeholder
        const nextLine = lines[i + 1]?.trim() || ''
        const nameCaption = nextLine.startsWith('[') ? nextLine : `[${label.toUpperCase()} NAME]`

        if (!signaturesRendered) {
          signatureParties.push(label)
          elements.push(
            <SignatureBlock
              key={`sigblock-${i}`}
              partyLabel={label}
              nameLabel={nameCaption}
            />
          )
          // Skip the name placeholder line
          if (nextLine.startsWith('[')) i++
          if (signatureParties.length >= 2) signaturesRendered = true
        }
        continue
      }

      // Skip other lines in the signature section (e.g., the bracketed name lines we already consumed)
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) continue

      // Any remaining content in signature section is skipped
      continue
    }

    // ── Numbered section header ─────────────────────────────────────────────
    if (isNumberedSection(trimmed)) {
      elements.push(
        <Text key={`section-${i}`} style={styles.sectionHeader}>
          {trimmed}
        </Text>
      )
      continue
    }

    // ── All-caps standalone heading ─────────────────────────────────────────
    if (isAllCapsHeading(trimmed)) {
      elements.push(
        <Text key={`heading-${i}`} style={styles.sectionHeader}>
          {trimmed}
        </Text>
      )
      continue
    }

    // ── Bullet line ─────────────────────────────────────────────────────────
    if (isBulletLine(raw)) {
      const bulletContent = trimmed.replace(/^-\s*/, '')
      elements.push(
        <View key={`bullet-${i}`} style={styles.bulletRow}>
          <Text style={styles.bulletDot}>•</Text>
          {renderTextWithPlaceholders(bulletContent, styles.bulletText, `bt-${i}`)}
        </View>
      )
      continue
    }

    // ── Sub-item (a), (b) ───────────────────────────────────────────────────
    if (isSubItemLine(raw)) {
      elements.push(
        renderTextWithPlaceholders(trimmed, styles.bodyIndented, `subitem-${i}`)
      )
      continue
    }

    // ── Indented line ───────────────────────────────────────────────────────
    if (isIndentedLine(raw) && trimmed) {
      elements.push(
        renderTextWithPlaceholders(trimmed, styles.bodyIndented, `indent-${i}`)
      )
      continue
    }

    // ── Signature underline line (outside signature section) ────────────────
    if (isSignatureLine(trimmed)) continue

    // ── Regular body text ───────────────────────────────────────────────────
    elements.push(renderTextWithPlaceholders(trimmed, styles.body, `body-${i}`))
  }

  return elements
}

// ─── Document component ───────────────────────────────────────────────────────

interface TemplateDocProps {
  name: string
  content: string
}

function TemplateDocument({ name, content }: TemplateDocProps) {
  // Strip the title line from content (first non-empty line) since we render it separately
  const allLines = content.split('\n')
  let titleLineIndex = allLines.findIndex((l) => l.trim().length > 0)
  const bodyLines = titleLineIndex >= 0 ? allLines.slice(titleLineIndex + 1) : allLines

  const generatedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const contentElements = renderContentLines(bodyLines)

  return (
    <Document
      title={name}
      author="FreelanceShield"
      subject="Freelancer Contract Template"
      creator="FreelanceShield"
      producer="FreelanceShield"
    >
      <Page size="A4" style={styles.page}>
        {/* Top blue stripe */}
        <View style={styles.accentBar} fixed />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.brandName}>FREELANCESHIELD</Text>
              <Text style={styles.brandTagline}>AI-Powered Contract Protection</Text>
            </View>
            <View>
              <Text style={styles.headerDate}>Generated {generatedDate}</Text>
            </View>
          </View>
          <View style={styles.headerRule} />
        </View>

        {/* Template title */}
        <View style={styles.titleBlock}>
          <Text style={styles.titleText}>{name.toUpperCase()}</Text>
          <Text style={styles.titleSubtext}>
            Fill in all{' '}
            <Text style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
              [highlighted fields]
            </Text>{' '}
            before signing
          </Text>
        </View>

        {/* Body content */}
        <View>{contentElements}</View>

        {/* Footer — fixed on every page */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerLeft}>
            FreelanceShield — Not legal advice. For informational purposes only.
          </Text>
          <Text
            style={styles.footerRight}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  )
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function generateTemplatePDF(name: string, content: string): Promise<Buffer> {
  const doc = <TemplateDocument name={name} content={content} />
  return renderToBuffer(doc)
}
