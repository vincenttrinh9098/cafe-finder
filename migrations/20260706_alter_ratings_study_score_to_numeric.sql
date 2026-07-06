-- Change the study_score column from an integer to a fixed-point decimal.
-- numeric(2,1) allows values from 0.0 to 9.9 with one digit after the decimal,
-- which lets us store weighted scores like 3.8 or 4.5.
--
-- The USING clause safely converts existing integer values (e.g. 3, 4, 5)
-- into the new numeric format (e.g. 3.0, 4.0, 5.0).

ALTER TABLE ratings
ALTER COLUMN study_score TYPE NUMERIC(2,1)
USING study_score::NUMERIC(2,1);

alter table ratings
alter column study_score type numeric(2,1)
using study_score::numeric(2,1);
