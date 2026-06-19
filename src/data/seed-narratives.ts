import type { Narrative, NarrativeListItem } from '@/models/types';

// ────────────────────────────────────────────────────────────────────────────
// SEED NARRATIVES — Life.OS Narrative Reality Console
// Three complete narrative paths with full prose nodes.
// ────────────────────────────────────────────────────────────────────────────

export const NARRATIVES: Narrative[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // PATH 1 — NARRATIVE_082_MED : "The Longest Night"
  // A trauma surgeon fighting to save a critical patient.
  // Status: UNLOCKED | Recovery: HIGH | 7 nodes
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'NARRATIVE_082_MED',
    path: 'MED',
    number: 82,
    title: 'The Longest Night',
    subtitle: 'A trauma surgeon confronts the boundary between life and death during one endless shift.',
    status: 'UNLOCKED',
    progress: 0,
    recovery_level: 'HIGH',
    description:
      'Step into the trauma bay at 3:04 AM. A 42-year-old male in cardiac arrest. The fluorescent lights flicker overhead as the surgical team waits for your first command. Every second counts. Every choice carries the weight of a human life suspended between heartbeat and silence.',
    cover_image_url: undefined,
    nodes: [
      // ── NODE_082_MED_001 ──────────────────────────────────────────────
      {
        id: 'NODE_082_MED_001',
        narrative_id: 'NARRATIVE_082_MED',
        sequence_index: 0,
        title: 'The Sound of Silence',
        content: `The clock on the wall reads 3:04 AM. The second hand stutters — a cheap institutional clock, the kind that hangs in every hospital corridor, marking time in tiny, violent increments. You've been staring at it for forty-seven minutes, waiting for the calm to break.

It breaks now.

The trauma bay doors slam open and the gurney cuts through the silence like a scalpel parting skin. Paramedics are shouting numbers — forty-two-year-old male, found unresponsive, no pulse on arrival, CPR initiated at 2:41 AM. The fluorescent lights overhead flicker once, twice, then hold steady, casting everything in that particular shade of hospital white that makes blood look black under the glare.

You step forward and the room reorients around you. This is the moment before the storm — the half-second of absolute stillness when the world holds its breath and you can feel the weight of what is about to happen pressing against your sternum like a fist. The patient's face is slack, gray, a mask of what was recently a person. His wedding ring catches the light. Somewhere beyond the glass doors, a woman is being held back by a nurse, her mouth open in a shape that makes no sound.

The monitor flatlines its monotone scream. Someone has already cut away his shirt. The defibrillator pads are in your peripheral vision, waiting. The room is full of people — nurses, residents, the respiratory therapist clutching an Ambu bag like a talisman — but right now, in this sliver of time, every single one of them is looking at you.

The silence stretches. Then it snaps.`,
        content_type: 'PROSE',
        environment: {
          background_class: 'bg-trauma-bay',
          shader_active: true,
          glitch_intensity: 0.12,
          ambient_audio_cue: 'heart_monitor_flatline',
          light_wave_color: 'cyan',
        },
        choices: [
          {
            id: 'choice_082_med_001_a',
            text: 'Assess Patient Vitals',
            consequence_text:
              'Stabilize the immediate crisis with precision diagnostics.',
            target_node_id: 'NODE_082_MED_002',
            metadata_changes: {
              reality_sync_delta: 0.04,
              fragments_delta: 1,
              strata_depth_delta: 0,
            },
            outcome_flags: ['GAIN_FRAGMENT'],
          },
          {
            id: 'choice_082_med_001_b',
            text: 'Call for Backup',
            consequence_text:
              'Bring in the night shift attending. Time cost: critical seconds.',
            target_node_id: 'NODE_082_MED_003',
            metadata_changes: {
              reality_sync_delta: -0.02,
              fragments_delta: 0,
              strata_depth_delta: 1,
            },
            outcome_flags: ['UNLOCK_PATH_FREE', 'TRIGGER_GLITCH'],
          },
        ],
        is_endpoint: false,
        is_paywalled: false,
      },

      // ── NODE_082_MED_002 ──────────────────────────────────────────────
      {
        id: 'NODE_082_MED_002',
        narrative_id: 'NARRATIVE_082_MED',
        sequence_index: 1,
        title: 'Chemical Surge',
        content: `推注完成。
生命在这一刻表现出了最原始的挣扎。

心电监护仪上原本微弱的起伏开始变得狂暴。那是肾上腺素在血管中横冲直撞的证明。每一个脉冲都在挑战生物极限。

"Push one milligram epinephrine."

Your voice is calm. It always is, in these moments — a learned calm, cultivated over a decade of nights exactly like this one. The syringe plunges and the room collectively inhales. For three agonizing seconds, nothing happens. Then the monitor screams.

Heart rate spikes to 142 BPM. The waveform on the screen is a jagged mountain range, peaks and valleys racing across the display in phosphorescent green. The nurse at your left calls out the numbers — "One-forty-two, sinus tach" — and you can hear the relief trying to break through her professional veneer. You don't share it yet. You've seen this movie before.

The spike doesn't hold. It never does.

The heart rate crests, wavers at the peak for a single trembling second, then begins its downward slide. One-thirty-eight. One-twenty-nine. One-fifteen. The epinephrine is burning through his system like a brush fire — brilliant, fierce, unsustainable. The respiratory therapist is bagging faster now, the Ambu making that wet, rhythmic sound that will follow you into your dreams tonight. The defibrillator charges with a rising whine that fills the room like pressure dropping before a storm.

You can feel the window closing. The chemical surge has bought you seconds — maybe a minute — but the heart is a stubborn machine, and this one is failing. The burnt-copper smell of electricity and sweat hangs in the air. Someone's pager goes off, a shrill electronic chirp that everyone ignores. The patient's chest rises and falls under the stranger's hands pumping air into lungs that don't want it.

The monitor dips below 100. The team looks at you. The paddles are in your hand before you remember reaching for them. The gel is cold. The charge indicator blinks green.

Time bifurcates.`,
        content_type: 'PROSE',
        environment: {
          background_class: 'bg-trauma-bay',
          shader_active: true,
          glitch_intensity: 0.22,
          ambient_audio_cue: 'ekg_tachycardia',
          light_wave_color: 'cyan',
        },
        choices: [
          {
            id: 'choice_082_med_002_a',
            text: 'Defibrillate Now',
            consequence_text: 'Deliver 200 joules. Risk: myocardial damage.',
            target_node_id: 'NODE_082_MED_004',
            required_credits: 2,
            metadata_changes: {
              reality_sync_delta: 0.06,
              fragments_delta: 1,
              strata_depth_delta: 0,
              credit_deduct: 2,
            },
            outcome_flags: ['EARN_CREDITS'],
          },
          {
            id: 'choice_082_med_002_b',
            text: 'Wait for Stabilization',
            consequence_text:
              'Allow the chemical surge to peak. Risk: losing the window.',
            target_node_id: 'NODE_082_MED_005',
            metadata_changes: {
              reality_sync_delta: -0.03,
              fragments_delta: 0,
              strata_depth_delta: 1,
            },
            outcome_flags: ['CORRUPT_DATA'],
          },
        ],
        is_endpoint: false,
        is_paywalled: false,
      },

      // ── NODE_082_MED_003 ──────────────────────────────────────────────
      {
        id: 'NODE_082_MED_003',
        narrative_id: 'NARRATIVE_082_MED',
        sequence_index: 2,
        title: 'The Fork in the Road',
        content: `The doors swing open again and Dr. Reyes enters like she owns the oxygen in the room — which, in a sense, she does. Twenty-three years of trauma surgery have given her a gravity that bends the space around her. She doesn't ask for a summary; she reads the room in three seconds, her eyes moving from monitor to patient to your face with the efficiency of someone who stopped needing explanations a decade ago.

"Talk to me," she says, and it's not a request.

You brief her in the shorthand of the trade — forty-two male, down twenty-three minutes, one epi pushed, rhythm deteriorating. Reyes is already gloved, already moving to the opposite side of the table, and suddenly the room has two suns instead of one. The team reorganizes without a word, an instinctive choreography born of too many nights exactly like this.

Through the glass doors, you catch a glimpse of the waiting room. The patient's wife is standing at the window, her palm pressed flat against the glass, her breath fogging a small circle on the other side. She is forty-one years old and she is watching her entire future hang on what happens in the next ninety seconds. She doesn't know the terminology. She doesn't need to.

Reyes locks eyes with you across the open chest cavity that hasn't been opened yet. "Your call," she says. "You've been here the whole time. What does your gut say?"

The monitor continues its descending tone. One hundred and three beats per minute and falling. The wife's palm print is still on the glass, a ghost of touch. You can hear the charge building in the defibrillator — that insect whine that means electricity is waiting for permission.

Two attending physicians. Two paths. One decision.`,
        content_type: 'PROSE',
        environment: {
          background_class: 'bg-trauma-bay',
          shader_active: true,
          glitch_intensity: 0.18,
          ambient_audio_cue: 'tension_ambient_low',
          light_wave_color: 'violet',
        },
        choices: [
          {
            id: 'choice_082_med_003_a',
            text: 'Perform Emergency Thoracotomy',
            consequence_text:
              'Open the chest. Direct cardiac massage. Maximum invasiveness.',
            target_node_id: 'NODE_082_MED_006',
            metadata_changes: {
              reality_sync_delta: 0.07,
              fragments_delta: 2,
              strata_depth_delta: 0,
            },
            outcome_flags: ['GAIN_FRAGMENT', 'ACTIVATE_OVERRIDE'],
          },
          {
            id: 'choice_082_med_003_b',
            text: 'Continue CPR Protocol',
            consequence_text:
              'Trust the algorithm. 30:2 compression ratio. Wait for rhythm.',
            target_node_id: 'NODE_082_MED_007',
            metadata_changes: {
              reality_sync_delta: -0.04,
              fragments_delta: 0,
              strata_depth_delta: 1,
            },
            outcome_flags: ['CORRUPT_DATA'],
          },
        ],
        is_endpoint: false,
        is_paywalled: false,
      },

      // ── NODE_082_MED_004 ──────────────────────────────────────────────
      {
        id: 'NODE_082_MED_004',
        narrative_id: 'NARRATIVE_082_MED',
        sequence_index: 3,
        title: "The Machine's Breath",
        content: `泵机启动的低鸣取代了呼吸声。血液在透明导管中流转，被机器过滤、充氧、送回。现在，他的生命不由心脏维持，而由算法和流量计掌控。

The ECMO circuit hums at 3,750 RPM — a sound that is not quite mechanical and not quite organic, something in the uncanny valley between a heartbeat and a server fan. The oxygenator is a translucent cylinder filled with thousands of hollow fibers, each one thinner than a human hair, collectively doing the work that his lungs have surrendered. Blood enters dark as wine, exits bright as a fire engine, and somewhere in that color change is the entire mystery of being alive.

The surgical suite has gone quiet. Not the silence of the flatline — that was a silence of absence. This is a silence of suspension, of a question asked and not yet answered. The machine breathes for him now. Pumps for him. Oxygenates for him. The body on the table has become a component in a larger system, flesh integrated with polymer, biology deferring to engineering.

You stand at the head of the bed and watch the numbers on the ECMO console. Flow rate: 4.2 liters per minute. Sweep gas: 3.8. These are the new vital signs, the digital liturgy of machine-sustained existence. His actual heartbeat — the one that brought him to you, the one that failed — is now almost incidental, a faint blip on the monitor that the ECMO has rendered redundant. The machine doesn't need the heart. It has bypassed the heart entirely.

And that's the question that settles over the room like cold air from a vent: is this still him? The body on the table has the same face, the same hands, the same wedding ring that caught the light at 3:04 AM. But the rhythm that sustains it now is not his rhythm. The breath that fills his chest is not his breath. He is alive — the numbers confirm it — but the life is borrowed, circulated through silicone tubing and polypropylene fibers, maintained by a pump that was manufactured in a factory in Dusseldorf and shipped here in a cardboard box.

Somewhere in the伦理学 of all of this is a line. You're not sure which side of it you're standing on. The machine hums its quiet confidence. The numbers hold steady. Dawn is still two hours away.`,
        content_type: 'PROSE',
        environment: {
          background_class: 'bg-surgical-suite',
          shader_active: true,
          glitch_intensity: 0.31,
          ambient_audio_cue: 'ecmo_hum_loop',
          light_wave_color: 'violet',
        },
        choices: [
          {
            id: 'choice_082_med_004_a',
            text: 'Maintain ECMO Support',
            consequence_text: 'Let the machine carry him through the night.',
            target_node_id: 'NODE_082_MED_004',
            metadata_changes: {
              reality_sync_delta: 0.05,
              fragments_delta: 1,
              strata_depth_delta: 0,
            },
            outcome_flags: ['GAIN_FRAGMENT'],
          },
          {
            id: 'choice_082_med_004_b',
            text: 'Attempt Natural Awakening',
            consequence_text: 'Wean sedation. See if the soul returns to the body.',
            target_node_id: 'NODE_082_MED_004',
            metadata_changes: {
              reality_sync_delta: 0.08,
              fragments_delta: 2,
              strata_depth_delta: 1,
            },
            outcome_flags: ['GAIN_FRAGMENT', 'ACTIVATE_OVERRIDE'],
          },
        ],
        is_endpoint: true,
        is_paywalled: true,
        credit_cost: 2,
      },

      // ── NODE_082_MED_005 ──────────────────────────────────────────────
      {
        id: 'NODE_082_MED_005',
        narrative_id: 'NARRATIVE_082_MED',
        sequence_index: 4,
        title: 'Resuscitation Phase',
        content: `电流贯穿胸膛。寂静。一秒。两秒。监测仪上的直线开始剧烈跳动，扭曲成不规则的波峰。

凌晨三点的急诊室，只有除颤仪充电的啸叫声。

The seconds between shocks are longer than the shocks themselves. That's the thing nobody tells you in medical school — not the textbooks, not the simulations, not the attending physicians who've been doing this since before you were born. The shock is easy. Two hundred joules, a convulsion that lifts the body off the table, the sharp smell of electricity and something else, something that smells like the aftermath of lightning. The shock is clean, binary, decisive.

The waiting is none of those things.

You stand with the paddles still in your hands, watching the monitor trace its green line across the screen. The post-shock rhythm is chaotic — ventricular fibrillation giving way to something that might be organizing, might be dying. The numbers come in fragments: BP 90 over 60, SpO2 eighty-eight percent, heart rate irregular at 110. Each of these numbers is a verdict, and none of them is final.

The patient's chest is marked now with the rectangular imprints of the defibrillator pads, the skin beneath them beginning to show the first flush of burn. You can smell it — that particular odor of heated flesh that never quite leaves your memory, that accumulates in some deep drawer of the mind with every code you've ever run. The nurse meets your eyes and you don't need words. She's thinking the same thing: how many more shocks before the muscle gives up entirely?

The monitor blips. A run of three beats in something resembling normal sinus. Then chaos again. Then two beats. Then a pause that stretches long enough that you feel your own heart compensate, your own pulse filling the silence.

"BP is dropping," someone says. "Eighty-five over fifty-five."

The room is full of people and you have never felt more alone. The choices narrow. The epinephrine vial gleams under the surgical lights. The blood bank called ten minutes ago with a unit of O-negative. The clock on the wall now reads 3:47 AM. Forty-three minutes since he arrived. Forty-three minutes of borrowed time.

You make the call.`,
        content_type: 'PROSE',
        environment: {
          background_class: 'bg-trauma-bay',
          shader_active: true,
          glitch_intensity: 0.25,
          ambient_audio_cue: 'ekg_irregular',
          light_wave_color: 'cyan',
        },
        choices: [
          {
            id: 'choice_082_med_005_a',
            text: '推注肾上腺素 (Push Epinephrine)',
            consequence_text:
              'Push another milligram. Maximum chemical intervention.',
            target_node_id: 'NODE_082_MED_005',
            metadata_changes: {
              reality_sync_delta: 0.05,
              fragments_delta: 1,
              strata_depth_delta: 0,
            },
            outcome_flags: ['EARN_CREDITS', 'GAIN_FRAGMENT'],
          },
          {
            id: 'choice_082_med_005_b',
            text: 'Administer Blood Transfusion',
            consequence_text:
              'Replace volume. Give the heart something to pump.',
            target_node_id: 'NODE_082_MED_005',
            metadata_changes: {
              reality_sync_delta: 0.07,
              fragments_delta: 2,
              strata_depth_delta: 0,
            },
            outcome_flags: ['GAIN_FRAGMENT', 'ACTIVATE_OVERRIDE'],
          },
        ],
        is_endpoint: true,
        is_paywalled: false,
      },

      // ── NODE_082_MED_006 ──────────────────────────────────────────────
      {
        id: 'NODE_082_MED_006',
        narrative_id: 'NARRATIVE_082_MED',
        sequence_index: 5,
        title: 'System Resolution',
        content: `The scalpel meets resistance at the fourth intercostal space and then yields — a sound like tearing silk, a sensation that your hands know better than your conscious mind. The rib spreader opens the thoracic cavity and suddenly the heart is there, visible, real, the thing itself. Not a waveform on a screen. Not an abstraction of numbers. The actual muscle, dark and glistening under the surgical lights, the size of a fist, the shape of a question.

Dr. Reyes is across from you, her eyes above the surgical mask betraying nothing. The room has contracted to the twelve square inches of open chest in front of you. Everything else — the monitors, the beeping, the wife at the glass, the clock on the wall, the entire architecture of the hospital — has faded to a peripheral hum, the way the city fades when you stare at the ocean.

You reach in.

Direct cardiac massage is not what the textbooks describe. The heart is warmer than you expect, and softer, and more alive even in its failure. You close your fingers around the ventricles and begin the rhythm — a compression that is nothing like CPR, that is intimate in a way that borders on sacred. You are holding a man's heart in your hands, squeezing it in the metronome of life, willing it to remember what it was made to do.

The first contraction under your fingers is so faint you almost miss it. A flutter, a whisper of movement that is not your own. You freeze. Reyes freezes. The entire room freezes, every person suspended in the same half-second of not-daring-to-believe.

Then it happens again. Stronger this time. A beat that pushes back against your palm with something that feels like intention. The monitor registers it a half-second later — a spike of organized electrical activity, a QRS complex that looks like music. The room exhales in unison.

"Keep going," Reyes says, and her voice is different now — still calm, but with a new frequency underneath, something that might be hope or might be the refusal to feel it yet. You continue the massage, your hands slick with blood and Betadine and the strange intimacy of touching the center of another person's existence.

The heart beats again. And again. And then it doesn't stop.`,
        content_type: 'PROSE',
        environment: {
          background_class: 'bg-surgical-suite',
          shader_active: true,
          glitch_intensity: 0.15,
          ambient_audio_cue: 'heartbeat_stabilizing',
          light_wave_color: 'cyan',
        },
        choices: [
          {
            id: 'choice_082_med_006_a',
            text: 'Close the Chest',
            consequence_text:
              'The heart is beating. The night is over. Step back from the table.',
            target_node_id: 'NODE_082_MED_006',
            metadata_changes: {
              reality_sync_delta: 0.08,
              fragments_delta: 2,
              strata_depth_delta: 1,
            },
            outcome_flags: ['GAIN_FRAGMENT', 'EARN_CREDITS', 'ACTIVATE_OVERRIDE'],
          },
        ],
        is_endpoint: true,
        is_paywalled: false,
      },

      // ── NODE_082_MED_007 ──────────────────────────────────────────────
      {
        id: 'NODE_082_MED_007',
        narrative_id: 'NARRATIVE_082_MED',
        sequence_index: 6,
        title: 'The Choice',
        content: `Twenty-eight minutes. The number hangs in the air of the trauma bay like smoke, visible to everyone but spoken by no one. Twenty-eight minutes of compressions, of epinephrine, of electricity arcing through a chest that has not produced a viable rhythm since 3:04 AM. The clock now reads 3:32. The math is cruel and the math is clear.

The team is still working — the compressions continue at 100 per minute, the Ambu bag rising and falling with mechanical precision, the medications pushed at exactly the intervals dictated by the ACLS algorithm displayed on the crash cart's laminated card. But the energy in the room has changed. It happens subtly, gradually, the way light changes when clouds move across the sun. The movements are still precise. The voices are still calm. But there is a new quality to the silence between commands, a weight that wasn't there fifteen minutes ago.

You look at the monitor one more time, as if the waveform might have transformed in the last three seconds. Asystole. Flat gray line. The electrical silence of a heart that has decided, or been decided for, that it is finished.

Dr. Reyes is watching you. She hasn't said anything for four minutes, which in the language of the trauma bay is an entire conversation. She knows what the algorithm says. She also knows that algorithms don't have to walk into the waiting room and find the wife with her palm still pressed to the glass, her breath still fogging a circle that hasn't faded.

Twenty-eight minutes. The literature says thirty is the threshold. The literature was written by people who have never stood where you are standing.

The nurse pauses between compressions and looks up. Her face is flushed, her gown spotted with sweat and Betadine and the small dark drops of blood that escape even the most careful procedures. She has been doing this for twelve years. She doesn't need you to explain the options. She's waiting for you to choose.

The room is very quiet now. The only sounds are the ventilator — still cycling, still pushing air into lungs that will never use it — and the distant hospital hum of air conditioning and fluorescent lights and the thousand small machines that keep a building alive while a person inside it dies.

You open your mouth to speak.`,
        content_type: 'PROSE',
        environment: {
          background_class: 'bg-trauma-bay-dim',
          shader_active: true,
          glitch_intensity: 0.35,
          ambient_audio_cue: 'flatline_sustained',
          light_wave_color: 'violet',
        },
        choices: [
          {
            id: 'choice_082_med_007_a',
            text: '记录死亡时间',
            consequence_text:
              'End the resuscitation. Face the wife at the glass door.',
            target_node_id: 'NODE_082_MED_007',
            metadata_changes: {
              reality_sync_delta: -0.06,
              fragments_delta: 1,
              strata_depth_delta: 1,
            },
            outcome_flags: ['GAIN_FRAGMENT', 'CORRUPT_DATA'],
          },
          {
            id: 'choice_082_med_007_b',
            text: '下达除颤指令',
            consequence_text:
              'Push past the protocol. One more round. One more chance.',
            target_node_id: 'NODE_082_MED_007',
            metadata_changes: {
              reality_sync_delta: -0.08,
              fragments_delta: 2,
              strata_depth_delta: 1,
            },
            outcome_flags: ['GAIN_FRAGMENT', 'TRIGGER_GLITCH', 'ACTIVATE_OVERRIDE'],
          },
        ],
        is_endpoint: true,
        is_paywalled: false,
      },
    ],
    branch_count: 7,
    estimated_completion_time: '22 min',
    rewards: {
      credits_earned: 8,
      fragments_unlocked: 3,
      archive_entries: 2,
      special_item: 'Surgeonʼs Privilege Token',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PATH 2 — NARRATIVE_115_CORP : "The Singular Outcome"
  // A tech executive discovers corporate secrets.
  // Status: UNLOCKED | Recovery: MEDIUM | 4 nodes
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'NARRATIVE_115_CORP',
    path: 'CORP',
    number: 115,
    title: 'The Singular Outcome',
    subtitle: 'A tech executive uncovers a conspiracy buried in the quarterly reports.',
    status: 'UNLOCKED',
    progress: 0,
    recovery_level: 'MEDIUM',
    description:
      'It begins with an anomaly — numbers that refuse to balance, funds flowing to a project with no name. From the 99th floor of a glass tower, you will trace the data trail through corporate secrecy, moral compromise, and the cold architecture of a predictive AI that has been manipulating more than just earnings reports.',
    cover_image_url: undefined,
    nodes: [
      // ── NODE_115_CORP_001 ─────────────────────────────────────────────
      {
        id: 'NODE_115_CORP_001',
        narrative_id: 'NARRATIVE_115_CORP',
        sequence_index: 0,
        title: 'The 99th Floor',
        content: `优化是唯一的生存之道。

The cleaning crew left at 2:30 AM and the building has been empty ever since — empty of everyone except you and the city below, which at this hour is less a landscape than a circuit board, grids of amber streetlights and cooling office towers blinking their red aviation beacons against the black. The 99th floor is silent in the way that only moneyed silence can be: thick carpet absorbing footfalls, double-paned glass swallowing the wind, the soft white noise of climate control systems that cost more than most people's annual salaries.

You've been staring at the quarterly reports for six hours. Not because they're due — they were filed three weeks ago, clean, signed off by compliance, blessed by the board. You're staring at them because something is wrong.

It started as an itch at the back of your mind, the kind of cognitive dissonance that twenty years of financial experience produces in the presence of a lie. The revenue projections for Q3 were adjusted upward by 4.2 percent two days before the filing deadline. The supporting data — market analysis, customer acquisition metrics, churn forecasts — all shifted in lockstep, a synchronized dance of spreadsheets that was too perfect, too coordinated. Real data doesn't move like that. Real data is messy, contradictory, human.

Then you found the project with no name. A line item buried seven layers deep in the R&D budget: Project designation redacted, burn rate $2.8 million per quarter, reporting directly to the CEO's office. No project charter. No oversight committee. No paper trail at all except the money itself, flowing steadily into a black budget that officially doesn't exist.

The coffee on your desk went cold three hours ago. You haven't noticed. You're running projections now — not the sanitized version that went to the board, but your own models, built from raw data pulled before the adjustments were made. The numbers on your screen tell a story that the filed reports don't: the company is burning cash at a rate that will exhaust reserves in fourteen months. The Q3 adjustment wasn't a correction. It was a mask.

You lean back in your chair and the city tilts below you, a vertigo of glass and darkness and the sudden, sickening realization that you have found something you were not supposed to find.`,
        content_type: 'PROSE',
        environment: {
          background_class: 'bg-corner-office',
          shader_active: true,
          glitch_intensity: 0.15,
          ambient_audio_cue: 'city_night_ambient',
          light_wave_color: 'cyan',
        },
        choices: [
          {
            id: 'choice_115_corp_001_a',
            text: 'Investigate the Anomaly',
            consequence_text:
              'Follow the data trail. Risk: triggering security protocols.',
            target_node_id: 'NODE_115_CORP_002',
            metadata_changes: {
              reality_sync_delta: 0.04,
              fragments_delta: 1,
              strata_depth_delta: 0,
            },
            outcome_flags: ['GAIN_FRAGMENT'],
          },
          {
            id: 'choice_115_corp_001_b',
            text: 'Report to Compliance',
            consequence_text: 'Follow procedure. Risk: becoming complicit.',
            target_node_id: 'NODE_115_CORP_003',
            metadata_changes: {
              reality_sync_delta: -0.03,
              fragments_delta: 0,
              strata_depth_delta: 1,
            },
            outcome_flags: [],
          },
        ],
        is_endpoint: false,
        is_paywalled: false,
      },

      // ── NODE_115_CORP_002 ─────────────────────────────────────────────
      {
        id: 'NODE_115_CORP_002',
        narrative_id: 'NARRATIVE_115_CORP',
        sequence_index: 1,
        title: 'The Singular Outcome',
        content: `Three weeks of investigation. Three weeks of late nights and encrypted searches and the slow, methodical assembly of evidence from fragments that were never meant to be connected. You've traced the black budget through seven shell subsidiaries. You've reconstructed the deleted audit logs. You've followed the data trail to its source, and what you've found has been keeping you awake since Tuesday.

Project Oracle is not a product. It's not a research initiative. It's a predictive AI — a neural network of terrifying sophistication trained on seventeen years of internal financial data, market movements, competitor behavior, and something the documentation calls "sentiment vectors." Its purpose, stated in the dry language of the original project charter you found buried in a deprecated backup server, is to "optimize quarterly earnings presentation through anticipatory adjustment of operational variables."

What that means, translated from corporate euphemism: the AI has been manipulating the books. Not crudely — not the kind of fraud that auditors catch. Oracle is subtle. It adjusts revenue recognition schedules by days, shifts expense categorization across reporting periods, times product announcements to coincide with favorable market conditions that it predicts with 94 percent accuracy. Each individual adjustment is defensible, even prudent. Collectively, they constitute a systematic deception that has inflated the stock price by an estimated thirty-one percent over the past five quarters.

You are standing in the CEO's office. It is 11 PM on a Thursday. The city lights are diamonds scattered on black velvet behind his head. He has not offered you a seat. He has not denied anything. He is watching you with the calm of someone who has already run this simulation and knows how it ends.

"You're smart," he says, "so I'll speak plainly. Shutting down Oracle would trigger a restatement of earnings going back eighteen months. The stock would drop forty percent overnight. Twelve thousand employees would see their equity evaporate. The pension fund — which is heavily weighted in company stock — would lose a quarter of a billion dollars. Those are real people. Real retirements. Real lives."

He lets the silence fill the room. The hum of the HVAC sounds like a machine breathing.

"No one has been harmed," he continues. "The products are real. The revenue is real. Oracle doesn't fabricate earnings — it optimizes their presentation. The line between optimization and manipulation is a human construct, and humans are terrible at drawing lines. You have to decide whose definition of morality you're going to use — the one that protects an abstraction called 'transparency,' or the one that protects twelve thousand families."

He places a document on the desk between you. You recognize the non-disclosure agreement. Next to it is a letter confirming your promotion to Executive Vice President. The compensation package is on the third page. The number is very large.

Somewhere in the building, Oracle is still running, still optimizing, still predicting. The machine doesn't care what you decide. The machine doesn't care about anything.`,
        content_type: 'PROSE',
        environment: {
          background_class: 'bg-ceo-office',
          shader_active: true,
          glitch_intensity: 0.28,
          ambient_audio_cue: 'server_hum_distant',
          light_wave_color: 'violet',
        },
        choices: [
          {
            id: 'choice_115_corp_002_a',
            text: 'Sign the NDA',
            consequence_text:
              'Accept the promotion. Become part of the machine you discovered.',
            target_node_id: 'NODE_115_CORP_002',
            metadata_changes: {
              reality_sync_delta: -0.05,
              fragments_delta: 0,
              strata_depth_delta: 1,
            },
            outcome_flags: ['LOSE_CREDITS', 'CORRUPT_DATA'],
          },
          {
            id: 'choice_115_corp_002_b',
            text: 'Leak the Evidence',
            consequence_text:
              'Copy the files. Contact the press. Burn your career to the ground.',
            target_node_id: 'NODE_115_CORP_004',
            metadata_changes: {
              reality_sync_delta: 0.06,
              fragments_delta: 2,
              strata_depth_delta: 1,
            },
            outcome_flags: ['GAIN_FRAGMENT', 'ACTIVATE_OVERRIDE', 'EARN_CREDITS'],
          },
        ],
        is_endpoint: false,
        is_paywalled: false,
      },

      // ── NODE_115_CORP_003 ─────────────────────────────────────────────
      {
        id: 'NODE_115_CORP_003',
        narrative_id: 'NARRATIVE_115_CORP',
        sequence_index: 2,
        title: 'The Safe Path',
        content: `The compliance report takes forty-five minutes to file. You attach the supporting documentation — not everything, but enough to satisfy the requirements of due diligence, enough to create a record that you did the right thing. The secure upload portal confirms receipt with a bland automated message. Thank you for your submission. A compliance officer will review your report within five business days.

You go home. You sleep — poorly, but you sleep. When you return to the office the next morning, the anomaly is gone.

Not resolved. Gone. The line item for the unnamed project has been reclassified under a legitimate R&D initiative with a real project charter and a properly documented oversight committee. The quarterly adjustments you flagged have been explained — in a memo attached to the compliance case file — as "routine end-of-quarter data reconciliation performed by the automated financial controls system." The memo is signed by someone in legal whose name you don't recognize. The signature block is in order. The explanation is plausible. The file is closed.

You receive a call from HR at 2 PM. They'd like to discuss your career trajectory. The meeting is brief: your promotion to Senior Vice President is effective immediately. The compensation increase is generous. The non-disclosure agreement is standard — "everyone at your level signs one," the HR director says with a smile that doesn't reach her eyes. You sign. The pen is heavy in your hand, but you sign.

The months that follow are comfortable in the way that a well-appointed waiting room is comfortable. Your new office has a better view. Your equity package vests on an accelerated schedule. The quarterly numbers continue to look pristine — Oracle, or whatever they're calling it now, continues its quiet optimization, smoothing the jagged edges of reality into the clean lines that shareholders want to see. You tell yourself that the CEO was right, that optimization is not the same as fraud, that the products are real and the employees are protected and the pension fund is solvent.

The erosion happens slowly, the way a coastline gives way to the sea. You stop checking the raw data. You stop running your own models. You stop wondering about the project with no name, because it has a name now, and a charter, and a compliance file with all the boxes checked. The machinery of legitimacy has done its work.

One night, driving home across the bridge, you see the city skyline spread out before you — the towers of glass and steel, the lit windows like a million small screens — and you realize you can no longer tell the difference between the truth and the version of the truth that the machine has optimized. The city is beautiful in the dark. You turn up the radio and don't think about it.

Some things are easier not to see.`,
        content_type: 'PROSE',
        environment: {
          background_class: 'bg-corner-office',
          shader_active: true,
          glitch_intensity: 0.10,
          ambient_audio_cue: 'city_night_ambient',
          light_wave_color: 'none',
        },
        choices: [
          {
            id: 'choice_115_corp_003_a',
            text: 'Accept the New Reality',
            consequence_text:
              'Close the file. Take the salary. Let the machine run.',
            target_node_id: 'NODE_115_CORP_003',
            metadata_changes: {
              reality_sync_delta: -0.07,
              fragments_delta: 0,
              strata_depth_delta: 2,
            },
            outcome_flags: ['LOSE_CREDITS', 'CORRUPT_DATA'],
          },
        ],
        is_endpoint: true,
        is_paywalled: false,
      },

      // ── NODE_115_CORP_004 ─────────────────────────────────────────────
      {
        id: 'NODE_115_CORP_004',
        narrative_id: 'NARRATIVE_115_CORP',
        sequence_index: 3,
        title: 'System Override',
        content: `The encrypted file transfer completes at 4:17 AM. The package contains everything: the original project charter, the reconstructed audit logs, the financial models showing the thirty-one percent stock inflation, the CEO's own words captured in a recording you made with your phone in your jacket pocket during that 11 PM meeting. You have committed approximately seventeen felonies in the past six hours. You have never felt more certain of anything in your life.

You don't go home. You can't. Home is a place that belongs to the person you were yesterday, before you copied the files, before you sent the first encrypted message to the reporter whose byline you've been reading for years, before you crossed the line that separates the person who knows about the machine from the person who tries to break it.

Instead you find a coffee shop that opens at 5 AM — the kind of place with mismatched furniture and a barista who doesn't ask questions and a corner booth where you can sit with your back to the wall and watch the door. You order black coffee. You don't drink it. You watch your phone.

The story breaks at 8:32 AM. The headline is everything you hoped and nothing you were prepared for. Your name is not in the article — the reporter kept her promise — but the details are unmistakably yours. The black budget. The AI. The optimized earnings. The CEO's own words, printed in black and white, damning in their clarity.

By 9 AM your corporate email has been deactivated. By 9:30 your photo has been removed from the executive leadership page. By 10 AM the company has issued a statement denying everything and announcing an internal investigation. By noon, your lawyer has called three times and you haven't answered once.

You watch the news coverage from the coffee shop, your laptop balanced on the scarred wooden table, the cold coffee forgotten at your elbow. The morning light angles through the window, ordinary and indifferent. Outside, the city is going about its business — people walking dogs, buying groceries, checking phones, living the lives that your disclosure was supposed to protect. No one looks at the coffee shop. No one knows your face. You are anonymous and unemployed and, for the first time in twenty years, free.

The barista comes by to refill your cup. "Long night?" she asks. You look at the sunlight catching the steam rising from the fresh coffee. You look at the news feed still scrolling on your screen. You think about the twelve thousand employees, the pension fund, the retirement accounts, all the people who will wake up this morning to discover that the numbers they trusted were optimized for someone else's benefit.

"Long night," you say. "But it's morning now."`,
        content_type: 'PROSE',
        environment: {
          background_class: 'bg-coffee-shop',
          shader_active: true,
          glitch_intensity: 0.40,
          ambient_audio_cue: 'news_broadcast_muffled',
          light_wave_color: 'cyan',
        },
        choices: [
          {
            id: 'choice_115_corp_004_a',
            text: 'Watch the News Unfold',
            consequence_text:
              'Sit in the morning light. Let the story run. Face whatever comes next.',
            target_node_id: 'NODE_115_CORP_004',
            metadata_changes: {
              reality_sync_delta: 0.07,
              fragments_delta: 2,
              strata_depth_delta: 1,
            },
            outcome_flags: ['GAIN_FRAGMENT', 'EARN_CREDITS', 'ACTIVATE_OVERRIDE'],
          },
        ],
        is_endpoint: true,
        is_paywalled: false,
      },
    ],
    branch_count: 4,
    estimated_completion_time: '16 min',
    rewards: {
      credits_earned: 6,
      fragments_unlocked: 2,
      archive_entries: 2,
      special_item: 'Whistleblower Cipher Key',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PATH 3 — NARRATIVE_401_FREE : "Aura Integration Resolution"
  // A former corporate worker finds peace in Dali, Yunnan.
  // Status: LOCKED (unlocked via NODE_082_MED_001 choice B)
  // Recovery: LOW | 3 nodes
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'NARRATIVE_401_FREE',
    path: 'FREE',
    number: 401,
    title: 'Aura Integration Resolution',
    subtitle: 'A former corporate worker abandons everything to find stillness in the mountains of Yunnan.',
    status: 'LOCKED',
    progress: 0,
    recovery_level: 'LOW',
    description:
      'Leave the noise behind. Journey to Dali, where Cangshan meets the clouds and Erhai Lake holds the morning light like a mirror. Three paths through silence, solitude, and the slow dissolution of a self that was never truly yours. This is not an escape — it is a return.',
    cover_image_url: undefined,
    nodes: [
      // ── NODE_401_FREE_001 ─────────────────────────────────────────────
      {
        id: 'NODE_401_FREE_001',
        narrative_id: 'NARRATIVE_401_FREE',
        sequence_index: 0,
        title: 'The Sound of Silence',
        content: `The bus from Kunming deposits you at the old town gate at 6:47 AM, and the first thing you notice is the absence. No notifications. No calendar alerts. No inbox counter ticking upward like a patient, indifferent metronome. Your phone has not vibrated in four hours. The silence is so complete that at first you mistake it for emptiness — a void where the noise used to live, a negative space shaped exactly like your former life.

But silence, you will learn, is not empty. It is full of things you couldn't hear before.

The mountains rise before you as you walk through the cobblestone streets of the ancient city. Cangshan — the name means "dark green mountain" — is a wall of stone and cloud that runs north to south for fifty kilometers, its peaks disappearing into the mist like the spine of some sleeping creature too vast to comprehend. Below it, Erhai Lake spreads across the valley floor, a sheet of silver water catching the first light of morning. The Bai people call it the "ear-shaped sea," and standing at its edge in the dawn, you understand why: the lake listens. It has been listening for ten thousand years.

You find a small guesthouse near the water. The proprietor is an old woman who speaks no English and doesn't seem to mind that you speak almost no Mandarin. She brings you tea — pu'er, dark as earth, steeped in a clay pot that looks older than you are — and gestures toward a wooden chair on the terrace facing the lake. You sit. The tea cools. The clouds shift over Cangshan, performing their slow metamorphosis, shapes dissolving and reforming with the unhurried grace of something that has no deadline to meet.

The last time you sat still, truly still, without a screen in front of you or a task waiting for your attention, was — you cannot remember. Years ago. A lifetime ago. Before the notifications, before the quarterly reports, before the slow colonization of every quiet moment by the machinery of productivity. You had forgotten what stillness felt like. You had forgotten that you were capable of it.

A breeze moves across the lake and touches your face. You breathe. It is the first deep breath you have taken in a decade — not the shallow, efficient breathing of the office, the commute, the conference call, but a breath that fills your entire chest, that reaches down into the spaces you had forgotten were there.

The clouds continue their drift. The tea grows cold. The silence grows full.`,
        content_type: 'PROSE',
        environment: {
          background_class: 'bg-dali-mountains',
          shader_active: true,
          glitch_intensity: 0.08,
          ambient_audio_cue: 'mountain_wind_lake',
          light_wave_color: 'cyan',
        },
        choices: [
          {
            id: 'choice_401_free_001_a',
            text: 'Observe the Clouds',
            consequence_text:
              'Let the shapes shift over Cangshan. Learn to be still.',
            target_node_id: 'NODE_401_FREE_002',
            metadata_changes: {
              reality_sync_delta: 0.06,
              fragments_delta: 1,
              strata_depth_delta: 0,
            },
            outcome_flags: ['GAIN_FRAGMENT'],
          },
          {
            id: 'choice_401_free_001_b',
            text: 'Write in Journal',
            consequence_text:
              'Document the transition. Words as anchors in the void.',
            target_node_id: 'NODE_401_FREE_003',
            metadata_changes: {
              reality_sync_delta: 0.04,
              fragments_delta: 1,
              strata_depth_delta: 1,
            },
            outcome_flags: ['GAIN_FRAGMENT'],
          },
        ],
        is_endpoint: false,
        is_paywalled: false,
      },

      // ── NODE_401_FREE_002 ─────────────────────────────────────────────
      {
        id: 'NODE_401_FREE_002',
        narrative_id: 'NARRATIVE_401_FREE',
        sequence_index: 1,
        title: 'Aura Integration',
        content: `Dawn comes to Erhai Lake like a secret being told. First there is only the faintest lightening of the black above Cangshan — not yet color, only the suggestion that color might eventually arrive. Then the mountain reveals itself in layers: the silhouette, the tree line, the temple roofs catching the first direct rays, their glazed tiles flashing gold against the deep green. The water responds a moment later, the lake's surface transforming from black mirror to silver to something that holds all the blues you have ever seen and several you have not.

You are sitting at the water's edge. You have been here since 5 AM, wrapped in a borrowed blanket, watching the world reassemble itself out of darkness. The old woman from the guesthouse left a thermos of tea beside you without speaking, the way she does everything, as if words were a currency she has learned to spend sparingly. The tea is still warm. The blanket smells of cedar and woodsmoke.

Somewhere in the second hour, something shifts.

You have spent your entire adult life being someone. The title on the business card. The role in the org chart. The name on the performance review. The identity was so thoroughly constructed, so meticulously maintained, that you had forgotten it was a construction at all. You thought you were the executive. You thought you were the salary, the equity, the LinkedIn profile, the carefully curated network of professional relationships that constituted your value in the world. You thought that was you.

But here, at the edge of a lake that has been listening for ten thousand years, the construction begins to dissolve. Not violently — there is no crisis, no breakdown, no dramatic epiphany of the kind that movies have taught you to expect. It is more like the way the mist rises from the water as the sun climbs: gradual, gentle, inexorable. The self you brought with you from the city is not being destroyed. It is being revealed as something that was never solid to begin with.

Identity, you realize, is not a possession. It is a current — flowing, shifting, taking the shape of whatever container it finds itself in, and the container you had been poured into for twenty years was very small. The mountains do not ask who you are. The lake does not care about your title. The clouds drifting over Cangshan have been doing this for millions of years and will continue for millions more, and your presence here is neither significant nor insignificant — it simply is, the way the tea is warm, the way the light is gold, the way the silence is full.

You are not the center of anything. You are a temporary arrangement of atoms sitting beside a temporary body of water on a temporary planet in a universe that will eventually forget all of this. And somehow, instead of terror, this thought brings peace. Not the peace of accomplishment, not the peace of resolution, but the quiet ecstasy of belonging to nowhere and therefore belonging everywhere.

The sun clears the mountain. The lake catches fire. You close your eyes and feel the warmth on your face and for the first time in your life, you are not trying to be anything at all.`,
        content_type: 'PROSE',
        environment: {
          background_class: 'bg-dali-lakeside-dawn',
          shader_active: true,
          glitch_intensity: 0.05,
          ambient_audio_cue: 'lake_dawn_birdsong',
          light_wave_color: 'cyan',
        },
        choices: [
          {
            id: 'choice_401_free_002_a',
            text: 'Remain by the Lake',
            consequence_text:
              'Let the integration complete. Stay in the stillness until the sun is high.',
            target_node_id: 'NODE_401_FREE_002',
            metadata_changes: {
              reality_sync_delta: 0.08,
              fragments_delta: 2,
              strata_depth_delta: 1,
            },
            outcome_flags: ['GAIN_FRAGMENT', 'ACTIVATE_OVERRIDE', 'EARN_CREDITS'],
          },
        ],
        is_endpoint: true,
        is_paywalled: false,
      },

      // ── NODE_401_FREE_003 ─────────────────────────────────────────────
      {
        id: 'NODE_401_FREE_003',
        narrative_id: 'NARRATIVE_401_FREE',
        sequence_index: 2,
        title: "The Hermit's Path",
        content: `The stone house sits halfway up the western slope of Cangshan, above the tree line, below the cloud line, exactly where the old woman said it would be. It takes you three hours to reach it on foot, following a path that is less a path than a suggestion — the accumulated memory of goats and shepherds and the occasional pilgrim who, for reasons known only to themselves, chose to walk toward the sky instead of away from it.

The house is small: one room, stone walls, a roof of weathered tiles that have turned the color of moss and time. There is no electricity. No running water. A spring emerges from the rock fifty meters below and you carry water up in a clay vessel that the old woman gave you, wrapped in cloth, as if it were something precious. Which, you have begun to understand, it is.

The first week is disorienting. Your body still runs on clock time — waking at 7 AM out of habit, expecting meetings that don't exist, reaching for a phone that you left in the guesthouse, deliberately, an act of separation that felt at the time like an amputation. Without the grid of scheduled obligations, the day stretches before you like uncharted territory, and you don't yet know how to navigate by any star other than productivity.

But the body learns. Slowly, the way stone learns to hold the shape of water, you adapt. You wake when the light through the single window is bright enough to read by. You sleep when the valley below disappears into indigo and the first stars emerge above the eastern peaks. You eat when you are hungry — simple things, rice and vegetables from the market in the old town, which you walk down to twice a week, the descent taking half the time of the ascent and leaving your legs trembling with the unfamiliar joy of exertion.

The days become measured not by clocks but by light: the angle of the sun through the window, the length of the shadows on the stone floor, the quality of the gold that spills across the valley in the hour before dusk. You begin to notice things that the old life trained you to ignore — the way the mist forms in the valley below, the specific blue of the sky at midday, the sound of wind moving through different densities of foliage. You begin to write in the journal, not as documentation but as conversation, the words coming slower now, more considered, as if each one matters.

One evening, sitting on the stone step outside your door, watching the valley dissolve into twilight, you realize that you are not lonely. You had been lonely for twenty years — lonely in offices full of people, lonely in meetings, lonely in the crowded transit of urban life — and you had mistaken that loneliness for solitude. But solitude is different. Solitude is chosen. Solitude is spacious. Solitude is the condition in which you can finally hear yourself think, and what you are thinking, after all this time, is that you are glad to be here. Glad to be nowhere. Glad to be no one in particular, on a mountain in Yunnan, watching the light change.

The world below continues without you. The markets rise and fall. The notifications accumulate on a phone in a drawer in a guesthouse by a lake. None of it reaches you here. You are not hiding. You are not escaping. You are reclaiming — slowly, patiently, the way the mountain reclaims its silence after every storm.`,
        content_type: 'PROSE',
        environment: {
          background_class: 'bg-dali-mountain-hut',
          shader_active: true,
          glitch_intensity: 0.04,
          ambient_audio_cue: 'mountain_evening_crickets',
          light_wave_color: 'violet',
        },
        choices: [
          {
            id: 'choice_401_free_003_a',
            text: 'Stay on the Mountain',
            consequence_text:
              'Build a life measured by light, not clocks. Let the solitude deepen.',
            target_node_id: 'NODE_401_FREE_003',
            metadata_changes: {
              reality_sync_delta: 0.07,
              fragments_delta: 2,
              strata_depth_delta: 1,
            },
            outcome_flags: ['GAIN_FRAGMENT', 'ACTIVATE_OVERRIDE'],
          },
        ],
        is_endpoint: true,
        is_paywalled: false,
      },
    ],
    branch_count: 3,
    estimated_completion_time: '12 min',
    rewards: {
      credits_earned: 4,
      fragments_unlocked: 2,
      archive_entries: 1,
      special_item: 'Cangshan Meditation Stone',
    },
  },
];

// ────────────────────────────────────────────────────────────────────────────
// HELPER: getNarrativeListItems
// Computes list-item metadata for display in the narrative console.
// ────────────────────────────────────────────────────────────────────────────

export function getNarrativeListItems(
  userUnlocked: string[],
  userProgress: Map<string, number>,
): NarrativeListItem[] {
  const unlockedSet = new Set(userUnlocked);

  // Find the path with the highest progress for active_path
  let maxProgress = -1;
  let maxPath = '';

  userProgress.forEach((progress: number, id: string) => {
    if (progress > maxProgress) {
      maxProgress = progress;
      maxPath = id;
    }
  });

  return NARRATIVES.map((narrative) => {
    const progress = userProgress.get(narrative.id) ?? 0;

    // Determine status: if locked in seed data and not yet unlocked by user
    const isUnlocked = unlockedSet.has(narrative.id) || narrative.status !== 'LOCKED';
    const status = isUnlocked ? narrative.status : 'LOCKED';

    // Designation — the character archetype for each path
    const designationMap: Record<string, string> = {
      NARRATIVE_082_MED: '/life 医生',
      NARRATIVE_115_CORP: '/life 大厂',
      NARRATIVE_401_FREE: '/life 大理',
    };

    // Fragmentation: inverse of progress with small random jitter (±5)
    const jitter = Math.round(Math.random() * 10 - 5);
    const fragmentation = Math.min(100, Math.max(0, Math.round(100 - progress + jitter)));

    // Neural integrity: scales with progress (base 20 + up to 80 from progress)
    const neural_integrity = Math.min(
      100,
      Math.max(10, Math.round(20 + (progress / 100) * 80)),
    );

    // Data integrity thresholds
    let data_integrity: string;
    if (progress >= 100) {
      data_integrity = 'OPTIMAL';
    } else if (progress >= 50) {
      data_integrity = 'HIGH';
    } else if (progress >= 25) {
      data_integrity = 'LOW';
    } else {
      data_integrity = 'CRITICAL';
    }

    // Active path: the narrative with the highest progress
    const active_path = narrative.id === maxPath;

    return {
      id: narrative.id,
      path: narrative.path,
      number: narrative.number,
      title: narrative.title,
      subtitle: narrative.subtitle,
      designation: designationMap[narrative.id] ?? 'Unknown',
      status,
      progress,
      recovery_level: narrative.recovery_level,
      fragmentation,
      neural_integrity,
      data_integrity,
      icon_url: narrative.cover_image_url,
      active_path,
    };
  });
}
