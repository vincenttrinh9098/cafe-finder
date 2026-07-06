# Study Score Algorithm

## Goal

Rather than relying only on a user's overall study rating, calculate a more objective **Study Score** using structured review attributes.

The backend computes a weighted score based on the user's personal study experience along with practical factors that affect studying in a cafe.

---

# Final Recommended Formula

| Factor | Weight |
|---------|--------|
| Personal Study Experience | 25% |
| Seating Availability | 35% |
| Outlet Availability | 20% |
| Noise Level | 20% |

Formula:

```text
study_score =
    personalStudyExperience * 0.25 +
    seatingScore            * 0.35 +
    outletScore             * 0.20 +
    noiseScore              * 0.20
```

Round the final value to **one decimal place** before storing it.

---

# Value Mapping

## Personal Study Experience

Current UI already provides:

| Selection | Value |
|-----------|------:|
| 😞 Poor | 1 |
| 😐 Average | 3 |
| 😊 Great | 5 |

---

## Seating Availability

| Response | Score |
|----------|------:|
| Plenty of seats | 5 |
| Some seats | 4 |
| Limited seats | 2 |
| Usually full | 1 |

---

## Outlet Availability

| Response | Score |
|----------|------:|
| Plenty of outlets | 5 |
| Some outlets available | 4 |
| Limited outlets | 2 |
| No visible outlets | 1 |

---

## Noise Level

| Response | Score |
|----------|------:|
| Very quiet | 5 |
| Quiet | 4 |
| Moderate noise | 3 |
| Loud | 2 |
| Very loud | 1 |

---

# Example

User submits:

| Category | Value |
|----------|------:|
| Personal Experience | 5 |
| Seating | Some seats (4) |
| Outlets | Limited outlets (2) |
| Noise | Quiet (4) |

Backend computes:

```text
study_score =
    5 × 0.25 +
    4 × 0.35 +
    2 × 0.20 +
    4 × 0.20

= 3.85

Rounded → 3.9
```

Database stores:

```json
{
  "study_score": 3.9
}
```

---

# Why These Weights?

The weighting is designed around what most students need from a study cafe.

### 1. Seating (35%)

Most important factor.

If there is nowhere to sit, the cafe is effectively unusable regardless of its other qualities.

---

### 2. Personal Study Experience (25%)

Captures qualities that structured metrics cannot easily measure, including:

- Overall atmosphere
- Lighting
- Comfort
- Cleanliness
- Table size
- Staff friendliness
- General productivity

This keeps the score grounded in real user experience.

---

### 3. Outlet Availability (20%)

Important for students using laptops, but not every study session requires charging.

---

### 4. Noise Level (20%)

Noise affects concentration but is somewhat subjective.

Some students prefer complete silence while others work better with moderate cafe ambience.

---

# Alternative Formulas Considered

## Option 1 — Equal Weighting

```text
25%
25%
25%
25%
```

**Pros**

- Extremely simple
- Easy to explain

**Cons**

- Treats every factor equally even though seating is generally more important.

---

## Option 2 — Personal Experience Focused

```text
Personal Experience 40%
Seating            25%
Outlets            20%
Noise              15%
```

**Pros**

- Prioritizes direct user opinion.

**Cons**

- Structured review data has less impact.

---

## Option 3 — Practical Study Needs

```text
Seating 40%
Outlets 30%
Noise   20%
Personal Experience 10%
```

**Pros**

- Very objective.

**Cons**

- Ignores overall study experience and cafe atmosphere.

---

## Option 4 — Penalty-Based System

Start with the user's personal rating and subtract points for dealbreakers.

Example:

- Usually full
- No visible outlets
- Very loud

**Pros**

- Easy to understand.

**Cons**

- Difficult to balance.
- One bad category can dominate the score.

---

## Option 5 — Hybrid with Score Caps

Compute a weighted average, but enforce maximum scores when major dealbreakers exist.

Example:

- Seating = Usually full → maximum score of 3.0
- Very loud → maximum score of 3.5

**Pros**

- Models real student behavior well.

**Cons**

- More complicated than necessary for the current application.

---

# Future Improvements

Potential factors that could be added in future versions:

- Wi-Fi quality
- Parking availability
- Foot traffic
- Table size
- Time limits
- Power outlet reliability
- Indoor vs. outdoor seating

As more review attributes become available, the weighting algorithm can be adjusted without changing the frontend review experience.

---

# Implementation Plan

1. User submits a review.
2. Backend converts text selections into numeric values.
3. Backend computes the weighted Study Score.
4. Result is rounded to one decimal place.
5. `study_score` is stored alongside the review.
6. Cafe Study Score is calculated from the aggregate of all review scores.

---

# Design Principles

- Keep the existing review UI unchanged.
- Perform all scoring on the backend.
- Use structured review attributes instead of only subjective ratings.
- Keep the algorithm simple enough to explain and tune.
- Allow future weighting adjustments without changing the frontend.