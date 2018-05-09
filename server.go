// package main

// import (
// 	"net/http"
// )

// func main() {
// 	http.Handle("/", http.FileServer(http.Dir("./")))
// 	http.ListenAndServe(":5000", nil)
// }

package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Printf("[GET] /%s\n", r.URL.Path[1:])
		http.ServeFile(w, r, r.URL.Path[1:])
	})
	log.Fatal(http.ListenAndServe(":5000", nil))
}
