## **Directory Structure**

This project is organized into several directories, each with a specific purpose:

**`common`**: Contains reusable components used in various parts of the application, including basic UI elements and domain-specific components.

**`modules`**: Hosts module components that represent specific functionalities of the application, encapsulating sets of related features.

**`ui`**: This directory is exclusively dedicated to components of the **[UI library](https://ui.shadcn.com/)**. It contains complex UI components and should only be used for components from this library.

Each of these directories is structured to keep the code organized, making navigation and development easier.

## **React.js components documentation**

We took inspiration from the NatSpec Solidity standard to bring the same clarity and detail to the documentation of our React.js components, creating a consistent documentation pattern throughout the project.

### **NatSpec-like comments for React.js**

React.js components are documented with detailed comments that explain their purpose and functionality, following an approach inspired by NatSpec. This includes describing props, states, and expected behaviors of the components to ensure that the code is easily understandable and maintainable.

### **Advantages of this approach:**

- **Unified documentation standards**: We maintain consistency in our codebases, making it easier to transition between UI development and smart contracts.
- **Improved readability and maintainability**: Clear and detailed comments promote better understanding of the code, useful for both new contributors and future reviews.
- **Integration with development tools**: We leverage the ability of comments to be interpreted by development tools, for both Solidity and React.js, enhancing the development experience with interactive features.

### **Example of documented React.js component**

```jsx
/**
 * @title Box Component
 * @notice Box is a reusable React component designed for wrapping child
 * elements.
 * @dev Box styles its children with rounded corners, shadow, padding, and
 * background color, making it versatile for various design needs. It is part
 * of a React-based web application.
 * @param {React.ReactNode} children - Child elements to be rendered within the
 * box.
 * @param {string} [className] - Optional additional CSS classes to apply for custom styling.
 */
const Box: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }: { children: React.ReactNode, className?: string }) => {
   return (
      <React.Fragment>
         <div className={twMerge('inline-grid w-full box-border bg-[#FEFEFE] shadow-box py-4 px-6 rounded-lg ', className)}>{children}</div>
      </React.Fragment>
   )
}

export default Box
```

By applying this detailed approach to documentation, our goal is to ensure that all components and contracts in our project are easily accessible and understood, thereby promoting a healthy and sustainable codebase.
