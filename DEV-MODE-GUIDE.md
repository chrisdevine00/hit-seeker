# Dev Mode Guide

Dev Mode provides troubleshooting tools and testing utilities for Hit Seeker.

## Accessing Dev Mode

Triple-tap the header area of any screen to toggle Dev Mode on/off. When enabled, a purple indicator appears and the Dev Tools panel becomes accessible.

---

## Dev Tools Panel Sections

### App State
Real-time status display showing:
- **Connection** - Supabase connection status with latency (ms)
- **User** - Currently logged in email
- **Trip** - Active trip name
- **Checked In** - Current casino location (if checked in)
- **Notes** - Total notes count for current trip
- **Platform** - Running environment (web/ios/android)
- **Errors** - Count of captured JavaScript errors

### Error Log
Expandable section showing captured JavaScript errors.
- View error source, timestamp, and message
- **Clear All** button to reset the log
- Useful for identifying issues that occurred during use

### Quick Fixes
Four action buttons for common troubleshooting:

| Button | When to Use |
|--------|-------------|
| **Force Refresh Data** | Data looks stale, teammates' spots not showing |
| **Refresh Auth Session** | Getting auth errors, "not logged in" messages |
| **Clear Cache & Reload** | App completely broken, showing old data that won't update |
| **Copy Debug Report** | Need to save current state for later troubleshooting |

### Demo Mode Toggle
Toggle switch to enable demo mode.
- **ON**: Shows sample/fake data for demonstrations
- **OFF**: Shows real data (normal operation)
- Useful when showing the app to others without exposing real trip data

### Geolocation Simulator
Test check-in flows without physically being at a casino:

| Option | Effect |
|--------|--------|
| **Near Bellagio** | Simulates GPS coordinates at Bellagio casino |
| **Not Near Casino** | Simulates being far from any Vegas casino |
| **GPS Error** | Simulates geolocation failure |
| **Real Location** | Uses actual device GPS (default) |

### Force Check-in
Bypass geolocation entirely by selecting a casino from the dropdown.
- Instantly checks you in to the selected casino
- Essential for testing when not physically in Vegas
- Works regardless of geolocation simulator setting

### LocalStorage Viewer
Expandable section showing all localStorage data:
- Key names and truncated values
- Size of each stored item
- **Delete** button (trash icon) for each key
- Useful for debugging state persistence issues

### Network Log
Shows recent Supabase API requests:
- **Status badge** - SUCCESS (green) or ERROR (red)
- **Timestamp** - When request occurred
- **Operation** - Table/operation name
- **Duration** - Request time in milliseconds
- **Clear All** button to reset the log
- Useful for debugging sync and data fetch issues

### Badge Unlock Test
Test badge celebration animations:
1. Select any badge from the dropdown
2. Click **Test** to preview the unlock celebration
- Shows celebration effect based on badge tier
- Useful for verifying celebration animations work

### Badge Celebration Preview
Quick-access buttons to preview celebrations:

**By Tier:**
- Common (minimal effect)
- Uncommon (confetti)
- Rare (confetti)
- Epic (confetti)
- Legendary (explosion)

**By Domain:**
- Slots (gold theme)
- VP (green theme)
- Bloody (red theme)
- Trip (rainbow theme)

**Special Effects:**
- Spicy (fire effect for spicy bloody badges)

### Data Export
Exports complete app state as JSON to clipboard:
- User info
- Current trip details
- Check-in status
- Recent notes (up to 50)
- All localStorage data
- Recent errors

### Other Tools
- **Strategy Validator** - Opens VP strategy validation testing tool

---

## Common Troubleshooting Scenarios

### "My teammate's spots aren't showing up"
1. Open Dev Tools
2. Tap **Force Refresh Data**
3. Wait for "Data refreshed!" confirmation

### "I'm getting logged out randomly"
1. Open Dev Tools
2. Tap **Refresh Auth Session**
3. If that fails, tap **Clear Cache & Reload**

### "Check-in button says I'm not near a casino" (but I am)
1. Open Dev Tools
2. Use **Force Check-in** dropdown
3. Select your current casino

### "Badge should have unlocked but didn't celebrate"
1. Open Dev Tools
2. Use **Badge Unlock Test** to verify celebrations work
3. The badge may still be earned - check Trip tab > Me > Achievements

### "App is completely frozen/broken"
1. Open Dev Tools (if possible)
2. Tap **Copy Debug Report** (to save state)
3. Tap **Clear Cache & Reload**
4. Sign back in

### "Need to report a bug"
1. Open Dev Tools
2. Tap **Data Export** to copy full state
3. Paste into a note/message for debugging later

---

## Tips

- Keep Dev Mode **OFF** during normal use to avoid accidental changes
- **Force Check-in** is your best friend when GPS is unreliable indoors
- **Copy Debug Report** before doing **Clear Cache & Reload** so you don't lose error info
- Network Log only captures requests while Dev Tools panel is open
