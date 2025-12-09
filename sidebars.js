/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a set of docs in the sidebar
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      label: 'Module 1: Foundations of Robotics',
      items: [
        'module-1-foundations/lesson-1-1-what-is-robotics',
        'module-1-foundations/lesson-1-2-robot-anatomy',
        'module-1-foundations/lesson-1-3-motors-sensors-control',
      ],
    },
    {
      label: 'Module 2: Programming Your First Robot',
      items: [
        'module-2-programming/lesson-2-1-python-basics',
        'module-2-programming/lesson-2-2-robot-control',
        'module-2-programming/lesson-2-3-logic-loops',
      ],
    },
    {
      label: 'Module 3: Sensing & Perception',
      items: [
        'module-3-sensing/lesson-3-1-computer-vision',
        'module-3-sensing/lesson-3-2-distance-sensors',
        'module-3-sensing/lesson-3-3-sensor-data',
      ],
    },
    {
      label: 'Module 4: Advanced Robotics',
      items: [
        'module-4-advanced/lesson-4-1-machine-learning',
        'module-4-advanced/lesson-4-2-autonomous-navigation',
        'module-4-advanced/lesson-4-3-multi-robot-systems',
      ],
    },
  ],
};

export default sidebars;
