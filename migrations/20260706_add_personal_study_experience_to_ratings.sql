-- Add the new column if it doesn't already exists
-- Stores the user's original personal study experience rating (1, 3, or 5).
alter table ratings
add column if not exists personal_study_experience smallint;

-- Remove the existing contraint if it exists
-- This allows the mirgation to be safely re-run without failing
alter table ratings
drop constraint if exists ratings_personal_study_experience_check;


-- Add a constraint to ensure only valid values can be stored.
-- Allowed values:
--   1 = Poor study experience
--   3 = Average study experience
--   5 = Great study experience
--   NULL is allowed for rows that have not been populated yet.
alter table ratings
add constraint ratings_personal_study_experience_check
check (
  personal_study_experience is null
  or personal_study_experience in (1, 3, 5)
);

-- If an older review stored the user's personal rating directly in study_score
-- (before study_score became a computed weighted value), copy that value into
-- personal_study_experience.
--
-- Only rows where study_score is exactly 1, 3, or 5 are copied, since those
-- represent the old rating system. Computed decimal scores (e.g. 3.8, 4.2)
-- are ignored.update ratings
update ratings
set personal_study_experience = study_score::smallint
where personal_study_experience is null
  and study_score in (1, 3, 5);
