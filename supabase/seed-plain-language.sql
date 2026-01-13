-- Seed Plain Language Summaries for V14.0
-- Top Priority Crisis and Community Services

INSERT INTO plain_language_summaries (service_id, what_is_it, how_to_get_help, call_us, visit_us, open_hours)
VALUES 
(
  'kids-help-phone', 
  'A national 24/7 service that helps young people with mental health, bullying, and any other problems.',
  'You can call a counsellor or send a text message to a volunteer anytime.',
  'Call 1-800-668-6868',
  'Visit kidshelpphone.ca to chat online.',
  'Always open (24 hours a day, 7 days a week).'
),
(
  'trans-lifeline-canada',
  'A support line for trans and non-binary people, run by trans people themselves.',
  'Call the hotline to talk to someone who understands trans issues. They will not call the police without your permission.',
  'Call 1-877-330-6366',
  'Visit translifeline.org for more information.',
  'Usually available in the afternoon and evening (see website for current hours).'
),
(
  'hope-for-wellness-helpline',
  'A service for all Indigenous people in Canada who need mental health support or someone to talk to.',
  'Call the toll-free number or use the online chat. They have counsellors who understand Indigenous culture.',
  'Call 1-855-242-3310',
  'Visit hopeforwellness.ca for online chat.',
  'Always open (24 hours a day, 7 days a week).'
),
(
  'assaulted-womens-helpline',
  'A private and safe way for women experiencing abuse to get help and planning for their safety.',
  'Call the hotline to talk to a counsellor who can help you find a safe place or plan your next steps.',
  'Call 1-866-863-0511 (or #SAFE on your cell phone)',
  'Visit awhl.org for safety information.',
  'Always open (24 hours a day, 7 days a week).'
),
(
  'victim-services-kingston',
  'Help and support for people who have been victims of a crime or a tragedy in Kingston.',
  'Call their office or ask the police to connect you. They can help with emotional support and finding money for emergencies.',
  'Call 613-548-4834',
  'Located inside the Kingston Police station at 705 Division St.',
  'Office: Monday-Friday (8:30 AM to 4:30 PM). Crisis support is available 24/7.'
)
ON CONFLICT (service_id) DO UPDATE SET
  what_is_it = EXCLUDED.what_is_it,
  how_to_get_help = EXCLUDED.how_to_get_help,
  call_us = EXCLUDED.call_us,
  visit_us = EXCLUDED.visit_us,
  open_hours = EXCLUDED.open_hours;
