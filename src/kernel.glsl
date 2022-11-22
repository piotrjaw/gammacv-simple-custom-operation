vec4 operation(float y, float x) {
  vec4 data = pickValue_tSrc(y, x);

  return vec4(
    (1.0 - data.a) * 1.0 + data.a * data.r,
    (1.0 - data.a) * 1.0 + data.a * data.g,
    (1.0 - data.a) * 1.0 + data.a * data.b,
    1.0
  );
}