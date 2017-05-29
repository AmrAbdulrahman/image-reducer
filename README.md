# Image Reducer

> This tool enables you to go over a directory of images and reduce it, so it can
> be served initially on a web page.
> Having this will enable you to have a lazy-loading function on a webpage and make it loads much faster.

## Install
`npm i -g image-reducer`

## Usage
`image-reducer -h` to see all options

### Options
```
Usage: index.js [options]

	--help, -h
		Displays help information about this script
		'index.js -h' or 'index.js --help'

	--dir, -d
		The input images directory, current directory by default

	--img, -i
		The input image path

	--out, -o
		The output images directory, current directory by default

	--quality, -q
		The output images quality, default 80

	--blur, -b
		The output images blur value, default 10

	--scale, -s
		The output images scaled by ratio, default 0.5

	--brightness, -b
		The output images brightness ratio, default 0.5
```

## Examples
`image-reducer --dir=~/original -out=~/out`

or use shorthands as following

`image-reducer -d ~/original -o ~/out`

## Sample output
```
Reducing 5 images...

5 image(s) processed

| FILE                                               | FROM (KB)  | TO (KB)    | LOSS %     |
| file1.jpg                                          | 242.21     | 9.51       | 96.07 %    |
| file2.jpg                                          | 793.35     | 14.12      | 98.22 %    |
| file3.jpeg                                         | 158.44     | 10.66      | 93.27 %    |
| file4.jpeg                                         | 668.02     | 42.22      | 93.68 %    |
| file5.jpg                                          | 2434.99    | 162.33     | 93.33 %    |

Time: 8566 ms
```

### Original (2.4 MB)
![Original](https://s4.postimg.org/va9rznv9p/file5.jpg)

### Reduced (162 KB, 93% less)
![Original](https://s22.postimg.org/e4japjcox/red-love-romantic-flowers.jpg)

## License
Come ooon..
