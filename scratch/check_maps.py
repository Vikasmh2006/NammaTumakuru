with open('scratch/maps_page.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'NR KITCHEN NATI STYLE BIRYANI[^"]*', text)
for m in set(matches[:10]):
    print('Match:', m[:120])

# Look for rating
ratings = re.findall(r'(\d\.\d)\s*stars|\b(\d\.\d)\b', text)
print('Possible ratings around name:')
for match in re.finditer(r'NR KITCHEN', text):
    snippet = text[max(0, match.start()-200):min(len(text), match.end()+300)]
    print('Snippet:', snippet[:250])
    break
