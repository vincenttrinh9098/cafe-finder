# Study Score Implementation

This file documents how the Study Score feature is implemented in the app.

`STUDYSCORE.md` explains the scoring formula. This file explains how the frontend, backend, and database use that formula.

## Database Fields

The `ratings` table uses two separate fields:

| Field | Purpose | Values |
|-------|---------|--------|
| `personal_study_experience` | Raw face-button choice from the user | `1`, `3`, or `5` |
| `study_score` | Backend-computed weighted score | decimal score such as `2.4`, `3.9`, `4.0` |

`personal_study_experience` should not be displayed as the final cafe study score. It is only one input into the algorithm.

`study_score` is the final computed score shown in profile cards and used in cafe aggregate averages.

## Create Review Flow

1. The frontend review form stores the selected face button in `scoreOption`.
2. The frontend sends it as:

```js
personal_study_experience: scoreOption
```

3. The backend validates that the value is `1`, `3`, or `5`.
4. The backend converts review attributes into numeric scores:
   - `seating`
   - `outlet`
   - `noise`
5. The backend computes `study_score` using the weighted formula.
6. The backend inserts both values:

```js
personal_study_experience: personalStudyExperience,
study_score: computedStudyScore,
```

## Edit Review Flow

1. The frontend edit modal initializes the selected face button from:

```js
selectedReview.personal_study_experience
```

2. The frontend submits all editable study attributes:

```js
{
  comments,
  noise,
  foot_traffic,
  seating,
  outlet,
  parking,
  personal_study_experience: scoreOption,
}
```

3. The backend fetches the existing review values needed for recalculation.
4. The backend merges existing values with incoming values.
5. The backend recalculates `study_score`.
6. The backend updates the raw review fields and the computed score.

## Migrations

The feature requires these migrations:

```text
migrations/20260706_add_personal_study_experience_to_ratings.sql
migrations/20260706_alter_ratings_study_score_to_numeric.sql
```

The first migration adds `personal_study_experience` and backfills old rows where possible.

The second migration changes `study_score` to `numeric(2,1)` so it can store computed decimal scores.

## Compatibility Note

The backend create route temporarily accepts the old `study_score` request field as a fallback input for `personal_study_experience`.

This exists only to support older frontend clients during the transition.

Once all clients send `personal_study_experience`, the fallback can be removed.

## Display Behavior

Profile review cards display `study_score`, not `personal_study_experience`.

Because `study_score` can be decimal, badge color uses ranges:

| Score Range | Badge |
|-------------|-------|
| `>= 4.0` | green |
| `>= 3.0` and `< 4.0` | yellow |
| `< 3.0` | red |

The displayed score uses one decimal place so it matches the backend-computed value.
