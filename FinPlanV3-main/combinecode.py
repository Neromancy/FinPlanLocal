import os

def combine_program_files(directory_path, output_filename="combined_code.txt"):
    """
    Traverses a directory, reads the content of program files,
    and combines them into a single output file.

    Args:
        directory_path (str): The path to the directory to be scanned.
        output_filename (str): The name of the file to store the combined code.
    """
    # A list of common programming file extensions to look for.
    # You can customize this list to include or exclude file types.
    programming_extensions = [
        '.py', '.java', '.c', '.h', '.cpp', '.hpp', '.js', '.html', '.css',
        '.ts', '.cs', '.go', '.php', '.rb', '.swift', '.kt', '.scala', '.m'
    ]

    # Check if the provided path is a valid directory.
    if not os.path.isdir(directory_path):
        print(f"Error: The path '{directory_path}' is not a valid directory.")
        return

    with open(output_filename, 'w', encoding='utf-8') as outfile:
        # os.walk recursively goes through the directory tree.
        for dirpath, _, filenames in os.walk(directory_path):
            for filename in filenames:
                # Check if the file has one of the specified extensions.
                if any(filename.endswith(ext) for ext in programming_extensions):
                    file_path = os.path.join(dirpath, filename)
                    
                    try:
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as infile:
                            # Write a header for each file to identify its content.
                            outfile.write(f"\n{'='*50}\n")
                            outfile.write(f"// File: {file_path}\n")
                            outfile.write(f"{'='*50}\n\n")
                            
                            # Write the content of the file to the output file.
                            outfile.write(infile.read())
                            outfile.write("\n")
                            
                    except Exception as e:
                        print(f"Could not read file {file_path}: {e}")

    print(f"All program files have been combined into '{output_filename}'")

if __name__ == "__main__":
    # Prompt the user to enter the directory path.
    folder_path = input("Enter the path to the folder: ")
    combine_program_files(folder_path)