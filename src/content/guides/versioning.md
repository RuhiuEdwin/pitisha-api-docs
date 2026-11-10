---
title: Versioning
description: How API versions are named and what we ask you to do about changes.
---

> **Proposed.** The API and its conventions are a proposal until the backend matches them. Anything about versioning that the backend does not yet do is marked below.

## Version names

A version is the date of the last change listed in the [changelog](/docs/changelog/). A second change on the same day adds a `.1`, `.2` and so on. The current version is shown at the top of every page and in the `info.version` field of the [OpenAPI file](/openapi.json).

## What we call a change

| Kind | Examples | What to do |
| --- | --- | --- |
| **New** | A new endpoint, a new optional field, a new event type, a new error code | Nothing. Your code should ignore fields and events it does not know. |
| **Changed** | A field gains a value, a guide is clarified | Read the entry. Most need no code change. |
| **Breaking** | A field is removed or renamed, a meaning changes | The changelog marks it **Breaking** and says what to do. |

## Build so that new things do not break you

- Ignore response fields you do not use.
- Handle an unknown event `type` by returning `2xx` and doing nothing.
- Branch on `error.code`, never on `error.message`.
- Treat `enum` values you do not recognise as a case to log, not to crash on.

## Not defined yet

- There is no version header to pin your integration to a date. Today every call uses the current version.
- There is no deprecation window or notice period. Both are to be decided with the backend.
