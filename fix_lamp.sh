sed -i '/<img/ {
  N
  N
  N
  N
  s/<img[^>]*>/<LampIllustration \/>/
}' src/pages/Login.tsx src/pages/Register.tsx
