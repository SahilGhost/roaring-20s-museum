// Historical content and answer keys. Reconstructions are explicitly identified.
// This educational game is client-side: competitive mode is a timed challenge,
// not a tamper-proof online competition. Sources accessed 14 October 2026.
export const SOURCES = [
  { id: 'versailles', title: 'The Paris Peace Conference and the Treaty of Versailles', author: 'Office of the Historian, U.S. Department of State', date: '1919', url: 'https://history.state.gov/milestones/1914-1920/paris-peace', type: 'Secondary: diplomatic history' },
  { id: 'fourteen', title: 'President Woodrow Wilson’s Fourteen Points', author: 'Woodrow Wilson; National Archives', date: '8 January 1918', url: 'https://www.archives.gov/milestone-documents/president-woodrow-wilsons-14-points', type: 'Primary: presidential address' },
  { id: 'hague', title: 'Agreement on Reparations Signed at The Hague', author: 'Governments party to the agreement; U.S. Office of the Historian', date: '20 January 1930', url: 'https://history.state.gov/historicaldocuments/frus1919Parisv13/ch36', type: 'Primary: agreement text' },
  { id: 'harding-audio', title: 'Readjustment [sound recording]', author: 'Warren G. Harding; Library of Congress', date: 'Recorded 29 June 1920', url: 'https://www.loc.gov/item/2016655168/', type: 'Primary: digitized original sound recording' },
  { id: 'coolidge-audio', title: 'Coolidge: Audio and Film Collections', author: 'Library of Congress', date: '1919–1920 recordings; 1920s films', url: 'https://guides.loc.gov/calvin-coolidge/digital-collections', type: 'Primary audiovisual collection guide' },
  { id: 'harding-speech', title: 'Readjustment', author: 'Warren G. Harding; hosted by the University of Virginia Miller Center', date: '14 May 1920', url: 'https://millercenter.org/the-presidency/presidential-speeches/may-14-1920-readjustment', type: 'Primary: speech transcript and historical recording' },
  { id: 'harding-policy', title: 'Warren G. Harding: Domestic Affairs', author: 'Eugene P. Trani, Miller Center', date: 'Undated', url: 'https://millercenter.org/president/harding/domestic-affairs', type: 'Secondary: historian’s analysis' },
  { id: 'gao', title: 'History', author: 'U.S. Government Accountability Office', date: 'Undated; describes 1921 founding', url: 'https://www.gao.gov/about/what-gao-does/history', type: 'Secondary: institutional history' },
  { id: 'rail-strike', title: 'Railroad Shopmen’s Strike of 1922', author: 'The Samuel Gompers Papers Project, University of Maryland', date: 'Undated; events of 1921–1924', url: 'https://gompers.umd.edu/RR%20strike%201922.htm', type: 'Secondary: documentary project historical summary' },
  { id: 'teapot-history', title: '100 Years Since Teapot Dome', author: 'U.S. Senate Historical Office', date: '1 July 2024', url: 'https://www.senate.gov/artandhistory/senate-stories/one-hundred-years-since-teapot-dome.htm', type: 'Secondary: institutional history with primary images' },
  { id: 'teapot-oversight', title: 'Senate Investigates the “Teapot Dome” Scandal', author: 'U.S. Senate Historical Office', date: 'Undated; chronology begins 15 April 1922', url: 'https://www.senate.gov/about/powers-procedures/investigations/senate-investigates-the-teapot-dome-scandal.htm', type: 'Secondary: institutional history' },
  { id: 'teapot-court', title: 'U.S. v. Albert B. Fall: The Teapot Dome Scandal', author: 'Federal Judicial Center', date: 'Undated', url: 'https://www.fjc.gov/history/cases/famous-federal-trials/us-v-albert-b-fall-teapot-dome-scandal', type: 'Secondary: judicial history' },
  { id: 'dawes', title: 'The Dawes Plan (1924)', author: 'Charles G. Dawes and the expert committee; German Historical Institute edition', date: '1924; report presented 9 April', url: 'https://germanhistorydocs.org/en/weimar-germany-1918-1933/the-dawes-plan-1924', type: 'Primary: report excerpts; secondary editorial introduction' },
  { id: 'state-dawes', title: 'The Dawes Plan, the Young Plan, German Reparations, and Inter-allied War Debts', author: 'Office of the Historian, U.S. Department of State', date: 'Undated; covers 1920s–1930s', url: 'https://history.state.gov/milestones/1921-1936/dawes', type: 'Secondary: diplomatic and financial history' },
  { id: 'naval', title: 'The Washington Naval Conference, 1921–1922', author: 'Office of the Historian, U.S. Department of State', date: 'Undated; retired historical series', url: 'https://history.state.gov/milestones/1921-1936/naval-conference', type: 'Secondary: diplomatic history' },
  { id: 'coolidge-message', title: 'Second Annual Message', author: 'Calvin Coolidge; National Archives text hosted by Miller Center', date: '3 December 1924', url: 'https://millercenter.org/the-presidency/presidential-speeches/december-3-1924-second-annual-message', type: 'Primary: presidential message to Congress' },
  { id: 'coolidge-policy', title: 'Calvin Coolidge: Domestic Affairs', author: 'David Greenberg, Miller Center', date: 'Undated', url: 'https://millercenter.org/president/coolidge/domestic-affairs', type: 'Secondary: historian’s analysis' },
  { id: 'coolidge-film', title: 'Silent Cal, Not So Silent', author: 'Mike Mashon, Library of Congress', date: '3 November 2016; includes film made 11 August 1924', url: 'https://blogs.loc.gov/now-see-hear/2016/11/silent-cal-not-so-silent/', type: 'Secondary: preservation essay; primary: embedded 1924 film' },
  { id: 'depression', title: 'The Great Depression', author: 'Gary Richardson, Federal Reserve History', date: 'Undated; covers 1929–1941', url: 'https://www.federalreservehistory.org/essays/great-depression', type: 'Secondary: economic history' }
];

export const EXHIBITS = [
  {
    "id": "campaign-1",
    "room": "campaign",
    "title": "Treaty of Versailles",
    "year": "28 June 1919",
    "code": "0628",
    "kind": "document",
    "description": "Signed in 1919, the Treaty of Versailles reshaped Germany’s borders, military power, and financial obligations. Its reparations provisions became a continuing problem in European diplomacy.",
    "clue": "What did the settlement require governments to do, and what practical difficulties might follow?",
    "sources": [
      "versailles"
    ]
  },
  {
    "id": "campaign-2",
    "room": "campaign",
    "title": "Wilson’s Fourteen Points",
    "year": "8 January 1918",
    "code": "0108",
    "kind": "poster",
    "description": "Wilson presented fourteen principles for a postwar peace in January 1918. His proposals linked diplomacy, territorial settlements, economic relations, and a permanent association of nations.",
    "clue": "Compare the goals in this proposal with the obligations created by the final peace settlement.",
    "sources": [
      "fourteen",
      "versailles"
    ]
  },
  {
    "id": "campaign-3",
    "room": "campaign",
    "title": "The Dawes Plan",
    "year": "1924",
    "code": "0816",
    "kind": "document",
    "description": "Charles G. Dawes chaired the committee that proposed a new approach to German reparations in 1924. Private international lending became central to the resulting recovery.",
    "clue": "Which document describes a financial mechanism rather than only a proposed principle or a treaty obligation?",
    "sources": [
      "dawes",
      "state-dawes"
    ]
  },
  {
    "id": "campaign-4",
    "room": "campaign",
    "title": "The Hague Agreement & Young Plan",
    "year": "1929–1930",
    "code": "1106",
    "kind": "document",
    "description": "The Young Plan and the Hague agreements attempted a longer-term settlement of German reparations. Their implementation coincided with a worsening international economic crisis.",
    "clue": "Consider how the date and purpose of this agreement compare with the earlier financial proposals.",
    "sources": [
      "hague",
      "state-dawes"
    ]
  },
  {
    "id": "industry-1",
    "room": "industry",
    "title": "Business Advisory Ledger",
    "year": "1920s",
    "kind": "ledger",
    "description": "Harding and Coolidge treated private enterprise as a major source of national prosperity. Commerce Secretary Herbert Hoover pursued cooperation and coordination among economic leaders.",
    "clue": "Compare the interests represented in this record with those in the workers’ records.",
    "sources": [
      "harding-policy"
    ]
  },
  {
    "id": "industry-2",
    "room": "industry",
    "title": "The Tariff Crate",
    "year": "1922",
    "kind": "crate",
    "description": "The Fordney–McCumber Tariff of 1922 raised duties on imported goods. Supporters saw protection for American production, while exporters and consumers faced different consequences.",
    "clue": "Follow the consequences beyond the producer: who bought the goods, and who needed access to overseas markets?",
    "sources": [
      "harding-policy"
    ]
  },
  {
    "id": "industry-3",
    "room": "industry",
    "title": "Shopmen’s Pay Record",
    "year": "1922",
    "kind": "ledger",
    "description": "Railroad shop workers challenged pay reductions and changing workplace rules in 1922. Their labor sustained a transport network serving factories, farms, and passengers.",
    "clue": "Look for what each side stood to lose, including rights that mattered after a strike ended.",
    "sources": [
      "rail-strike"
    ]
  },
  {
    "id": "industry-4",
    "room": "industry",
    "title": "The Injunction File",
    "year": "September 1922",
    "kind": "files",
    "description": "Federal courts intervened in the railroad strike through a nationwide injunction. The dispute raised questions about public service, property, labor organization, and federal power.",
    "clue": "Compare the government’s stated public purpose with the consequences for the groups directly involved.",
    "sources": [
      "rail-strike",
      "coolidge-message"
    ]
  },
  {
    "id": "teapot-1",
    "room": "teapot",
    "title": "Doheny Ledger",
    "year": "1921–1922",
    "kind": "document",
    "description": "Edward L. Doheny’s payment to Albert Fall became a central piece of evidence in the oil scandal. Doheny’s company benefited from the Elk Hills lease in California.",
    "clue": "Compare the personal transaction with the public responsibility held by its recipient.",
    "sources": [
      "teapot-history",
      "teapot-court"
    ],
    "caseNote": "The evidence-box account records the Doheny entry as one quarter of its full balance."
  },
  {
    "id": "teapot-2",
    "room": "teapot",
    "title": "Sinclair Dealings",
    "year": "1922–1924",
    "kind": "document",
    "description": "Harry F. Sinclair’s company obtained the Teapot Dome lease in Wyoming. Investigators followed financial benefits associated with the agreement and Fall’s personal circumstances.",
    "clue": "Distinguish the kinds of value appearing in the records before treating them as one account.",
    "sources": [
      "teapot-history",
      "teapot-oversight"
    ],
    "caseNote": "A second entry in the evidence-box account is valued at twice the Doheny entry. Check which balance the box actually requests."
  },
  {
    "id": "teapot-3",
    "room": "teapot",
    "title": "Secret Cash Trail",
    "year": "1921–1924",
    "kind": "document",
    "description": "Investigators questioned how Fall financed ranch purchases and improvements. The inquiry connected public decisions in Washington with private property dealings in New Mexico.",
    "clue": "What amount is actually recorded, and what does the evidence reveal about its recipient’s circumstances?",
    "sources": [
      "teapot-oversight",
      "teapot-court"
    ]
  },
  {
    "id": "teapot-4",
    "room": "teapot",
    "title": "Teapot Dome & the Ohio Gang",
    "year": "1921–1924",
    "kind": "document",
    "description": "Harding’s administration faced scandals involving several appointees. Teapot Dome became the best-known example of the damage corruption could do to public trust.",
    "clue": "Consider the responsibilities of appointees, the president, Congress, and the courts in the same investigation.",
    "sources": [
      "teapot-history",
      "teapot-oversight",
      "teapot-court"
    ]
  },
  {
    "id": "diplomacy-1",
    "room": "diplomacy",
    "title": "File TA · The Revenue Acts",
    "year": "1921, 1924, 1926",
    "code": "TA",
    "kind": "files",
    "description": "The Revenue Acts of 1921, 1924, and 1926 reduced federal tax rates across the Harding and Coolidge administrations. Treasury Secretary Andrew Mellon was a leading advocate.",
    "clue": "What change in government revenue policy does this file describe, and who expected to benefit?",
    "sources": [
      "harding-policy",
      "coolidge-policy"
    ]
  },
  {
    "id": "diplomacy-4",
    "room": "diplomacy",
    "title": "File RE · The End of World War I",
    "year": "1917–1918",
    "code": "RE",
    "kind": "files",
    "description": "The end of World War I brought demobilization and a difficult transition to peacetime production. The consequences shaped both the American economy and the European settlement.",
    "clue": "Which consequences continued after the military fighting ended?",
    "sources": [
      "harding-policy",
      "versailles"
    ]
  },
  {
    "id": "diplomacy-2",
    "room": "diplomacy",
    "title": "File XE · Return to Normalcy",
    "year": "1920–1923",
    "code": "XE",
    "kind": "files",
    "description": "Harding’s return-to-normalcy campaign connected postwar recovery with a more conservative federal agenda. His administration pursued business support alongside changes in public budgeting.",
    "clue": "Trace the movement from a postwar political promise to specific decisions made after the election.",
    "sources": [
      "harding-speech",
      "harding-policy",
      "gao"
    ],
    "media": "harding-audio"
  },
  {
    "id": "diplomacy-5",
    "room": "diplomacy",
    "title": "File T · Teapot Dome",
    "year": "1922–1924",
    "code": "T",
    "kind": "files",
    "description": "The Teapot Dome investigation linked secret oil leases with personal benefits to a federal official. Its exposure became a major test of public accountability.",
    "clue": "What evidence would distinguish a legitimate policy decision from an abuse of official power?",
    "sources": [
      "teapot-history",
      "teapot-oversight"
    ]
  },
  {
    "id": "diplomacy-6",
    "room": "diplomacy",
    "title": "File AS · Washington Naval Conference",
    "year": "1921–1922",
    "code": "AS",
    "kind": "files",
    "description": "The Washington Naval Conference brought major powers together in 1921–1922. Agreements on naval strength and Pacific interests showed a continuing American diplomatic role.",
    "clue": "Identify the policy instrument at work here: what did the participating governments agree to limit or discuss?",
    "sources": [
      "naval"
    ]
  },
  {
    "id": "diplomacy-3",
    "room": "diplomacy",
    "title": "File S · Struggling Farmers",
    "year": "1920s",
    "code": "S",
    "kind": "files",
    "description": "Farmers faced low prices and debt despite the decade’s industrial expansion. The debate over federal farm relief exposed differences within the image of nationwide prosperity.",
    "clue": "Consider the relationship between the amount produced, the price received, and the debts already owed.",
    "sources": [
      "coolidge-policy",
      "coolidge-message"
    ]
  },
  {
    "id": "study-1",
    "room": "study",
    "title": "Coolidge’s Public Message",
    "year": "1924",
    "kind": "document",
    "description": "Coolidge’s December 1924 message to Congress presented prosperity, economy, and tax reduction as major presidential priorities. It also addressed the practical work of governing.",
    "clue": "Compare the president’s claims about national prosperity with the experiences recorded elsewhere in the museum.",
    "sources": [
      "coolidge-message"
    ]
  },
  {
    "id": "study-2",
    "room": "study",
    "title": "Silent Cal Press Card",
    "year": "1923–1929",
    "kind": "files",
    "description": "Coolidge’s quiet and frugal public image contrasted with Harding’s sociable manner. That image supported a presidency emphasizing restraint, enterprise, and confidence in existing institutions.",
    "clue": "What qualities did this public image communicate, and how might different audiences have interpreted them?",
    "sources": [
      "coolidge-policy",
      "coolidge-message"
    ]
  },
  {
    "id": "study-3",
    "room": "study",
    "title": "Silent Cal, Public Voice",
    "year": "1924",
    "kind": "radio",
    "description": "Coolidge used radio and sound film despite his quiet reputation. Modern media allowed a president’s voice and image to reach audiences far beyond Washington.",
    "clue": "Compare the impression created by a nickname with the evidence preserved in the president’s public communications.",
    "sources": [
      "coolidge-film",
      "coolidge-audio"
    ],
    "media": "coolidge-audio"
  },
  {
    "id": "study-4",
    "room": "study",
    "title": "The Final Interpretation Scroll",
    "year": "Your historical conclusion",
    "kind": "scroll",
    "description": "The decade’s history combines economic expansion, unequal experiences, public scandal, and international financial dependence. Interpreting those connections requires distinguishing intentions from outcomes.",
    "clue": "Build an interpretation that accounts for both benefits and costs across more than one gallery.",
    "sources": [
      "teapot-history",
      "coolidge-message",
      "state-dawes"
    ]
  }
];

export const PUZZLES = {
  "campaign": {
    "title": "The Reparations Door",
    "prompt": "Which 1924 artifact used American-backed credit to help Germany make reparations payments? Enter its four-digit museum archive stamp.",
    "code": "0816",
    "intro": "World War I left Europe with competing peace plans, reparations obligations, and large wartime debts. American leaders avoided some political commitments but remained closely involved in trade and finance. Investigate the four documents to identify the arrangement described at this door.",
    "hints": [
      "Compare the dates and purposes of the documents.",
      "Distinguish the creation of a financial obligation from a later effort to make payments possible.",
      "Look for the mechanism connecting private lending with government payments."
    ]
  },
  "industry": {
    "title": "Whose prosperity?",
    "prompt": "Compare the business and labor exhibits. Explain how policy affected different groups.",
    "steps": [
      {
        "question": "What do the business advisory ledger and tariff crate show together?",
        "options": [
          {
            "id": "a",
            "text": "Government actively shaped conditions for business."
          },
          {
            "id": "b",
            "text": "All producers and workers received identical benefits."
          },
          {
            "id": "c",
            "text": "The federal government stopped making economic policy."
          }
        ],
        "answer": "a",
        "explanation": "Tax and tariff choices are government actions, including when intended to support private enterprise.",
        "sourceIds": [
          "harding-policy"
        ]
      },
      {
        "question": "Which evidence most directly challenges the idea that normalcy meant staying out of labor disputes?",
        "options": [
          {
            "id": "a",
            "text": "A factory’s physical machinery determined every labor outcome."
          },
          {
            "id": "b",
            "text": "An injunction restricted activity during the railroad strike."
          },
          {
            "id": "c",
            "text": "Harding used a campaign slogan."
          }
        ],
        "answer": "b",
        "explanation": "The injunction used federal authority during the dispute. The shopmen’s pay record explains the workers’ grievance.",
        "sourceIds": [
          "rail-strike"
        ]
      },
      {
        "question": "Why did the railway dispute concern people beyond the shop workers and railroad companies?",
        "options": [
          {
            "id": "a",
            "text": "Railroads made the location of farms and cities irrelevant."
          },
          {
            "id": "b",
            "text": "Only people employed by a railroad could be affected."
          },
          {
            "id": "c",
            "text": "A transport network connected distant producers, workers, and customers, spreading the effects of disruption."
          }
        ],
        "answer": "c",
        "explanation": "This is an inference from the transport evidence: human-built connections link economic life across places.",
        "sourceIds": [
          "rail-strike",
          "coolidge-message"
        ]
      }
    ],
    "hints": [
      "Consider whose interests each record represents.",
      "Compare voluntary discussions with enforceable federal action.",
      "Trace how the consequences moved beyond the immediate workplace."
    ]
  },
  "teapot": {
    "title": "The Evidence Box",
    "prompt": "Using the investigator annotations, determine the full account balance requested by the evidence box. Enter six digits.",
    "code": "400000",
    "intro": "The oil inquiry followed the relationship between federal leases, personal transactions, and changes in an official’s wealth. Examine the ledgers and investigator annotations before opening the evidence box.",
    "hints": [
      "Identify which account balance the box is asking for.",
      "An amount may appear in several records; check whether those records describe the same transfer.",
      "Determine whether the amount you found represents the whole account or only a stated share."
    ]
  },
  "diplomacy": {
    "title": "The Six Scattered Files",
    "prompt": "Find the tax policy, the president’s plan, and the group harmed by falling prices. Combine the correct file labels in that order.",
    "code": "TAXES",
    "requiredIds": [
      "diplomacy-1",
      "diplomacy-2",
      "diplomacy-3"
    ],
    "intro": "Harding promised a return to normalcy after World War I and backed business through tax reductions, less direct regulation, and spending restraint. Treasury Secretary Andrew Mellon advocated lower tax rates. Coolidge continued many of these policies after 1923. Industrial growth did not reach everyone: falling crop prices and debt hurt farmers. Six files are scattered here; three answer the clues, and three provide other historical context.",
    "hints": [
      "Group the records by the subject each one addresses.",
      "Each clue concerns a policy choice or an economic experience.",
      "Follow the clues’ stated order rather than arranging the file labels alphabetically."
    ]
  },
  "study": {
    "title": "Write the final interpretation",
    "prompt": "Interpret the evidence from all five galleries. Complete this challenge to unlock the bibliography room, then open its door to finish your escape.",
    "steps": [
      {
        "question": "How should a historian evaluate Coolidge’s calm, pro-business message?",
        "options": [
          {
            "id": "a",
            "text": "Accept a president’s optimism as proof that everyone prospered."
          },
          {
            "id": "b",
            "text": "Discard every political speech as useless."
          },
          {
            "id": "c",
            "text": "Use it to identify his priorities, then compare it with farm and other evidence."
          }
        ],
        "answer": "c",
        "explanation": "The primary message is valuable evidence of perspective. Different experiences help test the breadth of its claims.",
        "sourceIds": [
          "coolidge-message",
          "coolidge-policy"
        ]
      },
      {
        "question": "What does the radio exhibit add to our understanding of “Silent Cal”?",
        "options": [
          {
            "id": "a",
            "text": "A restrained public image could coexist with modern methods of reaching large audiences."
          },
          {
            "id": "b",
            "text": "Coolidge never addressed an audience."
          },
          {
            "id": "c",
            "text": "Radio removed differences between urban and rural economies."
          }
        ],
        "answer": "a",
        "explanation": "The sound film and radio appearances complicate the nickname. A communication technology does not by itself erase economic differences.",
        "sourceIds": [
          "coolidge-film"
        ]
      },
      {
        "question": "D1 — What can interpretations of the 1920s teach us about cause, change, and current policy?",
        "options": [
          {
            "id": "a",
            "text": "The boom proves that all tax cuts always benefit everyone equally."
          },
          {
            "id": "b",
            "text": "Compare growth with uneven benefits, corruption with oversight, and the Dawes Plan’s recovery with dependence on U.S. loans. Such evidence helps citizens weigh regulation, labor protections, and international risk today."
          },
          {
            "id": "c",
            "text": "One scandal caused every economic problem of the decade."
          }
        ],
        "answer": "b",
        "explanation": "The 1920s show that policies can spur growth while creating uneven outcomes; oversight matters when officials abuse authority, and international credit can stabilize economies while creating vulnerabilities. Read both complete EQ answers in the Reference Room.",
        "sourceIds": [
          "teapot-history",
          "coolidge-message",
          "state-dawes"
        ]
      }
    ],
    "hints": [
      "Consider what a presidential statement can establish and what requires other evidence.",
      "Compare a public reputation with documented actions.",
      "Weigh intended benefits, differing experiences, and longer-term consequences together."
    ]
  }
};
