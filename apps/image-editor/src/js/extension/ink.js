const fabric = global.fabric || (global.fabric = {});

/**
 * MyFilter filter class
 * @class fabric.Image.filters.MyFilter
 * @memberOf fabric.Image.filters
 * @extends fabric.Image.filters.BaseFilter
 * @see {@link fabric.Image.filters.MyFilter#initialize} for constructor definition
 * @see {@link http://fabricjs.com/image-filters|ImageFilters demo}
 * @example
 * var filter = new fabric.Image.filters.MyFilter({
 *   add here an example of how to use your filter
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
const Ink = fabric.util.createClass(
  fabric.Image.filters.BaseFilter,
  /** @lends fabric.Image.filters.MyFilter.prototype */ {
    /**
     * Filter type
     * @param {String} type
     * @default
     */
    type: 'Ink',

    /**
     * Fragment source for the myParameter program
     */
    fragmentSource:
      'precision highp float;\n' +
      'uniform sampler2D uTexture;\n' +
      'uniform float uMyParameter;\n' +
      'varying vec2 vTexCoord;\n' +
      'void main() {\n' +
      'vec4 color = texture2D(uTexture, vTexCoord);\n' +
      // add your gl code here
      'gl_FragColor = color;\n' +
      '}',

    /**
     * MyFilter value, from -1 to 1.
     * translated to -255 to 255 for 2d
     * 0.0039215686 is the part of 1 that get translated to 1 in 2d
     * @param {Number} myParameter
     * @default
     */
    ink: 0,

    initialize(options) {
      if (!options) {
        options = {};
      }
      this.ink = options.ink;
    },

    /**
     * Describe the property that is the filter parameter
     * @param {String} m
     * @default
     */
    mainParameter: 'ink',

    /**
     * Apply the MyFilter operation to a Uint8ClampedArray representing the pixels of an image.
     *
     * @param {Object} options canvas
     * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
     */
    applyTo2d(options) {
      if (this.ink === 0) {
        // early return if the parameter value has a neutral value
        return;
      }
      const { data } = options.imageData;
      let i;
      const len = data.length;
      for (i = 0; i < len; i += 4) {
        data[i] = this.ink;
        data[i + 1] = this.ink;
        data[i + 2] = this.ink;
      }
    },

    /**
     * Return WebGL uniform locations for this filter's shader.
     *
     * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
     * @param {WebGLShaderProgram} program This filter's compiled shader program.
     * @returns {gl}
     * @private
     */
    getUniformLocations(gl, program) {
      return {
        uMyParameter: gl.getUniformLocation(program, 'uMyParameter'),
      };
    },

    /**
     * Send data from this filter to its shader program's uniforms.
     *
     * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
     * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
     */
    sendUniformData(gl, uniformLocations) {
      gl.uniform1f(uniformLocations.uMyParameter, this.ink);
    },
  }
);

export default Ink;
